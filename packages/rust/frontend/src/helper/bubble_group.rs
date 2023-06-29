use crate::api::BubbleApi;
use crate::application_message::Message;
use crate::helper::resource_fetcher::ResourceFetcher;
use crate::mls_provider::MlsProvider;
use crate::Error;
use openmls::framing::MlsMessageOut;
use openmls::prelude::{GroupId, InnerState, LeafNodeIndex, Member, MlsGroup, TlsSerializeTrait};
use openmls_basic_credential::SignatureKeyPair;
use openmls_traits::OpenMlsCryptoProvider;
use std::ops::{Deref, DerefMut};
use uuid::Uuid;

pub struct BubbleGroup {
    group: MlsGroup,
    group_uuid: Uuid,
}

impl BubbleGroup {
    pub fn new(group: MlsGroup) -> Self {
        let group_uuid = Uuid::from_slice(group.group_id().as_slice()).unwrap();
        Self { group, group_uuid }
    }

    pub fn new_from_uuid(
        group_uuid: &Uuid,
        mls_provider: &impl OpenMlsCryptoProvider,
    ) -> Option<Self> {
        MlsGroup::load(&GroupId::from_slice(group_uuid.as_ref()), mls_provider).map(Self::new)
    }

    pub fn group_uuid(&self) -> Uuid {
        self.group_uuid
    }
}

impl Deref for BubbleGroup {
    type Target = MlsGroup;

    fn deref(&self) -> &Self::Target {
        &self.group
    }
}

impl DerefMut for BubbleGroup {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.group
    }
}

impl BubbleGroup {
    pub fn get_group_members(&self) -> Result<Vec<(Uuid, LeafNodeIndex)>, Error> {
        let members: Vec<Member> = self.group.members().collect();
        let mut client_uuids = Vec::with_capacity(members.len());
        for member in members {
            let client_uuid = Uuid::from_slice(member.credential.identity())
                .map_err(|e| Error::UuidParseError("member.credential", e))?;
            client_uuids.push((client_uuid, member.index));
        }
        Ok(client_uuids)
    }

    pub async fn get_group_members_by_user_uuid(
        &self,
        user_uuid: &Uuid,
        resource_fetcher: &ResourceFetcher,
    ) -> Result<Vec<(Uuid, LeafNodeIndex)>, Error> {
        let members = self.get_group_members()?;
        let mut out = Vec::with_capacity(members.len());
        for (client_uuid, index) in members {
            let client = resource_fetcher
                .get_client_partial_authentication(&client_uuid)
                .await?;
            if &client.user_uuid == user_uuid {
                out.push((client_uuid, index));
            }
        }
        Ok(out)
    }

    pub fn save_if_needed(&mut self, mls_provider: &MlsProvider) -> Result<(), Error> {
        if matches!(self.group.state_changed(), InnerState::Changed) {
            self.group.save(mls_provider)?
        }
        Ok(())
    }

    pub async fn send_message(
        &self,
        api: &BubbleApi,
        message: &MlsMessageOut,
        exclude: &[Uuid],
    ) -> Result<(), Error> {
        let members = self.get_group_members()?;
        let recipients = members
            .into_iter()
            .filter(|(uuid, _)| !exclude.contains(uuid))
            .map(|(uuid, _)| uuid)
            .collect::<Vec<_>>();
        let bytes = message.tls_serialize_detached()?;
        api.send_message(recipients, bytes, self.group_uuid).await?;
        Ok(())
    }

    pub async fn send_application_message(
        &mut self,
        mls_provider: &MlsProvider,
        api: &BubbleApi,
        signer: &SignatureKeyPair,
        message: &Message,
    ) -> Result<(), Error> {
        let mls_message = serde_json::to_string(message)?;
        let mls_message_bytes = mls_message.as_bytes();
        let mls_out = self
            .group
            .create_message(mls_provider, signer, mls_message_bytes)?;
        self.send_message(api, &mls_out, &[]).await?;
        Ok(())
    }
}