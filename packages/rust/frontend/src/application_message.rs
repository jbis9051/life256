use bridge_macro::bridge;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(tag = "type")]
#[serde(rename_all = "snake_case")]
pub enum Message {
    Location(Location),
}

#[derive(Debug, Deserialize, Serialize)]
#[bridge]
pub struct Location {
    pub latitude: f64,
    pub longitude: f64,
    pub timestamp: i64,
}