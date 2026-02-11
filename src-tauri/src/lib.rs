mod crypto;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            crypto::aes_encrypt,
            crypto::aes_decrypt,
            crypto::rsa_encrypt,
            crypto::rsa_decrypt,
            crypto::md5_hash,
            crypto::sha256_hash,
            crypto::sha512_hash,
            crypto::hmac_hash,
            crypto::base64_encode,
            crypto::base64_decode,
            crypto::hex_encode,
            crypto::hex_decode,
            crypto::url_encode,
            crypto::url_decode,
            crypto::generate_aes_key,
            crypto::generate_aes_iv,
            crypto::generate_rsa_keypair,
            crypto::generate_random_key,
            crypto::ecc_encrypt,
            crypto::ecc_decrypt,
            crypto::generate_ecc_keypair,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
