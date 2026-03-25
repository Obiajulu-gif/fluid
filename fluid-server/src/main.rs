use axum::{routing::get, Json, Router};
use serde::Serialize;
use std::net::SocketAddr;
use tracing::info;

use fluid_server::grpc::serve_grpc;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok" })
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "fluid_server=info".into()),
        )
        .init();

    let http_port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(3001);
    let grpc_port: u16 = std::env::var("GRPC_PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(50051);

    let http_addr = SocketAddr::from(([0, 0, 0, 0], http_port));
    let grpc_addr = SocketAddr::from(([0, 0, 0, 0], grpc_port));

    info!("Starting Fluid Rust services");

    tokio::try_join!(run_http_server(http_addr), serve_grpc(grpc_addr))?;

    Ok(())
}

async fn run_http_server(addr: SocketAddr) -> Result<(), Box<dyn std::error::Error>> {
    let app = Router::new().route("/health", get(health));
    info!("Fluid server (Rust) listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
