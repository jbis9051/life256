use crate::DbPool;
use sqlx::postgres::PgRow;
use sqlx::types::chrono;
use sqlx::types::Uuid;
use sqlx::Row;

// Based on up.sql
pub struct Group {
    //ids and uuids are mutually unique
    pub id: i32,
    pub uuid: Uuid,
    pub group_name: String,
    pub created: chrono::NaiveDateTime,
    pub members: Vec<i32>,
}

pub fn call_user(row: &PgRow) -> Group {
    Group {
        id: row.get("id"),
        uuid: row.get("uuid"),
        group_name: row.get("group_name"),
        created: row.get("created"),
        members: Vec::new(),
    }
}
// CRUD functions
impl Group {
    pub async fn create(db: &DbPool, group: &mut Group) -> Result<(), sqlx::Error> {
        let row =
            sqlx::query("INSERT INTO \"group\" (uuid, group_name) VALUES ($1, $2) RETURNING *;")
                .bind(&group.uuid)
                .bind(&group.group_name)
                .fetch_one(db)
                .await?;
        let group_db = call_user(&row);
        group.created = group_db.created;
        Ok(())
    }
}

//     //TENTATIVE, PoolConnection<Postgres> is not used
//     pub async fn read(db: &DbPool, uuid: &str) -> Result<Group, Error> {
//         let id = get_group_id(uuid);
//         let stream = sqlx::query("SELECT * FROM group WHERE id = $1")
//             .bind(id)
//             .execute(db)
//             .await?;
//         let group = call_user(row);
//         let stream_join = sqlx::query("SELECT group_id FROM user_group WHERE group_id = $1")
//             .bind(id)
//             .fetch(&mut connection)
//             .await?;
//         while let Some(user_id) = stream_join.try_next().await? {
//             group.members.append(user_id.try_get("user_id"))?;
//         }
//         Ok(group)
//     }
// }

//
// pub fn get_group_id(db: &DbPool, uuid: &str) -> i32 {
//     let groupID = sqlx::query("SELECT id FROM group WHERE uuid = $1")
//         .bind(uuid)
//         .execute(db)
//         .await?;
//
//     groupID
// }
//
// pub fn add_users(db: &DbPool, uuid: &str, mut new_users: &[i32]) {
//     for i in new_users {
//         let userID = sqlx::query("SELECT id FROM user WHERE uuid = $1")
//             .bind(i)
//             .execute(db)
//             .await?;
//         sqlx::query(
//             "INSERT INTO user_group (user_id, group_id, role_id, created)
//                     VALUES ($1, $2, $3, $4);",
//         )
//         .bind(userID)
//         .bind(get_group_id(uuid))
//         .bind(roleID)
//         .bind(SystemTime::now())
//         .execute(db)
//         .await?;
//     }
// }
//
// pub fn delete_users(db: Extension<&DbPool>, uuid: &str, users_to_delete: &[i32]) {
//     for i in users_to_delete {
//         let userID = sqlx::query("SELECT id FROM user WHERE uuid = $1")
//             .bind(i)
//             .execute(db)
//             .await?;
//         sqlx::query("DELETE FROM user_group WHERE user_id = $1 && group_id = $2")
//             .bind(userID)
//             .bind(get_group_id(uuid))
//             .execute(db)
//             .await?;
//     }
// }
//
// pub fn change_name(db: Extension<&DbPool>, uuid: &str, name: String) {
//     sqlx::query("UPDATE group SET group_name = $1 WHERE id = $2")
//         .bind(name)
//         .bind(get_group_id(uuid))
//         .execute(db)
//         .await?;
// }
//
// pub fn delete_group(db: Extension<&DbPool>, uuid: &str) {
//     sqlx::query("DELETE FROM group WHERE uuid = $1")
//         .bind(uuid)
//         .execute(db)
//         .await?;
// }
