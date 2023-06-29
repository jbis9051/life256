use crate::api::BubbleApi;
use common::http_types::{KeyPackagePublic, PublicClient};
use openmls::prelude::KeyPackage;
use uuid::Uuid;

impl BubbleApi {
    pub async fn request_key_package(
        &self,
        client_uuid: &Uuid,
    ) -> Result<KeyPackage, reqwest::Error> {
        let key_package: KeyPackagePublic = self
            .client
            .get(&format!(
                "{}/v1/client/{}/key_package",
                self.domain, client_uuid
            ))
            .send()
            .await?
            .json()
            .await?;
        let key_package = key_package.key_package;
        let key_package: KeyPackage = serde_json::from_slice(&key_package).unwrap();
        Ok(key_package)
    }

    pub async fn get_client(&self, client_uuid: &Uuid) -> Result<PublicClient, reqwest::Error> {
        let client: PublicClient = self
            .client
            .get(&format!("{}/v1/client/{}", self.domain, client_uuid))
            .send()
            .await?
            .json()
            .await?;
        Ok(client)
    }
}