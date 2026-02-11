use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use base64::{engine::general_purpose::STANDARD, Engine as _};
use md5::Md5;
use rand::rngs::OsRng;
use rsa::{
    pkcs1::{DecodeRsaPublicKey, EncodeRsaPublicKey, LineEnding},
    pkcs8::{DecodePrivateKey, EncodePrivateKey},
    Pkcs1v15Encrypt, RsaPrivateKey, RsaPublicKey,
};
use sha2::{Digest, Sha256, Sha512};

type Aes256CbcEnc = cbc::Encryptor<aes::Aes256>;
type Aes256CbcDec = cbc::Decryptor<aes::Aes256>;

#[tauri::command]
pub fn aes_encrypt(text: &str, key: &str, iv: &str) -> Result<String, String> {
    let key_bytes = hex::decode(key).map_err(|e| format!("密钥 Hex 解码失败: {:?}", e))?;
    let iv_bytes = hex::decode(iv).map_err(|e| format!("IV Hex 解码失败: {:?}", e))?;

    if key_bytes.len() != 32 {
        return Err(format!(
            "AES-256 需要 32 字节密钥，当前 {} 字节",
            key_bytes.len()
        ));
    }
    if iv_bytes.len() != 16 {
        return Err(format!(
            "AES CBC 需要 16 字节 IV，当前 {} 字节",
            iv_bytes.len()
        ));
    }

    let mut key_array = [0u8; 32];
    key_array.copy_from_slice(&key_bytes);

    let mut iv_array = [0u8; 16];
    iv_array.copy_from_slice(&iv_bytes);

    let cipher = Aes256CbcEnc::new(&key_array.into(), &iv_array.into());
    let mut buffer = vec![0u8; text.len() + 16];

    let encrypted = cipher
        .encrypt_padded_b2b_mut::<Pkcs7>(text.as_bytes(), &mut buffer)
        .map_err(|e| format!("加密失败: {:?}", e))?;

    Ok(STANDARD.encode(encrypted))
}

#[tauri::command]
pub fn aes_decrypt(encrypted_text: &str, key: &str, iv: &str) -> Result<String, String> {
    let encrypted_data = STANDARD
        .decode(encrypted_text)
        .map_err(|e| format!("Base64 解码失败: {:?}", e))?;

    let key_bytes = hex::decode(key).map_err(|e| format!("密钥 Hex 解码失败: {:?}", e))?;
    let iv_bytes = hex::decode(iv).map_err(|e| format!("IV Hex 解码失败: {:?}", e))?;

    if key_bytes.len() != 32 {
        return Err(format!(
            "AES-256 需要 32 字节密钥，当前 {} 字节",
            key_bytes.len()
        ));
    }
    if iv_bytes.len() != 16 {
        return Err(format!(
            "AES CBC 需要 16 字节 IV，当前 {} 字节",
            iv_bytes.len()
        ));
    }

    let mut key_array = [0u8; 32];
    key_array.copy_from_slice(&key_bytes);

    let mut iv_array = [0u8; 16];
    iv_array.copy_from_slice(&iv_bytes);

    let cipher = Aes256CbcDec::new(&key_array.into(), &iv_array.into());
    let mut buffer = vec![0u8; encrypted_data.len()];

    let decrypted = cipher
        .decrypt_padded_b2b_mut::<Pkcs7>(&encrypted_data, &mut buffer)
        .map_err(|e| format!("解密失败: {:?}", e))?;

    String::from_utf8(decrypted.to_vec()).map_err(|e| format!("UTF-8 解码失败: {:?}", e))
}

#[tauri::command]
pub fn rsa_encrypt(text: &str, public_key_pem: &str) -> Result<String, String> {
    let public_key = RsaPublicKey::from_pkcs1_pem(public_key_pem)
        .map_err(|e| format!("解析公钥失败: {:?}", e))?;

    let mut rng = OsRng;
    let encrypted = public_key
        .encrypt(&mut rng, Pkcs1v15Encrypt, text.as_bytes())
        .map_err(|e| format!("RSA 加密失败: {:?}", e))?;

    Ok(STANDARD.encode(encrypted))
}

#[tauri::command]
pub fn rsa_decrypt(encrypted_text: &str, private_key_pem: &str) -> Result<String, String> {
    let private_key = RsaPrivateKey::from_pkcs8_pem(private_key_pem)
        .map_err(|e| format!("解析私钥失败: {:?}", e))?;

    let encrypted_data = STANDARD
        .decode(encrypted_text)
        .map_err(|e| format!("Base64 解码失败: {:?}", e))?;

    let decrypted = private_key
        .decrypt(Pkcs1v15Encrypt, &encrypted_data)
        .map_err(|e| format!("RSA 解密失败: {:?}", e))?;

    String::from_utf8(decrypted).map_err(|e| format!("UTF-8 解码失败: {:?}", e))
}

#[tauri::command]
pub fn md5_hash(text: &str) -> String {
    let mut hasher = Md5::new();
    hasher.update(text.as_bytes());
    hex::encode(hasher.finalize())
}

#[tauri::command]
pub fn sha256_hash(text: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(text.as_bytes());
    hex::encode(hasher.finalize())
}

#[tauri::command]
pub fn sha512_hash(text: &str) -> String {
    let mut hasher = Sha512::new();
    hasher.update(text.as_bytes());
    hex::encode(hasher.finalize())
}

#[tauri::command]
pub fn base64_encode(text: &str) -> String {
    STANDARD.encode(text.as_bytes())
}

#[tauri::command]
pub fn base64_decode(encoded: &str) -> Result<String, String> {
    let decoded = STANDARD
        .decode(encoded)
        .map_err(|e| format!("Base64 解码失败: {:?}", e))?;
    String::from_utf8(decoded).map_err(|e| format!("UTF-8 解码失败: {:?}", e))
}

#[tauri::command]
pub fn hex_encode(text: &str) -> String {
    hex::encode(text.as_bytes())
}

#[tauri::command]
pub fn hex_decode(encoded: &str) -> Result<String, String> {
    let decoded = hex::decode(encoded).map_err(|e| format!("Hex 解码失败: {:?}", e))?;
    String::from_utf8(decoded).map_err(|e| format!("UTF-8 解码失败: {:?}", e))
}

#[tauri::command]
pub fn url_encode(text: &str) -> String {
    urlencoding::encode(text).to_string()
}

#[tauri::command]
pub fn url_decode(encoded: &str) -> Result<String, String> {
    urlencoding::decode(encoded)
        .map(|s| s.to_string())
        .map_err(|e| format!("URL 解码失败: {:?}", e))
}

#[tauri::command]
pub fn generate_aes_key() -> String {
    let key: [u8; 32] = rand::random();
    hex::encode(key)
}

#[tauri::command]
pub fn generate_aes_iv() -> String {
    let iv: [u8; 16] = rand::random();
    hex::encode(iv)
}

#[derive(serde::Serialize)]
pub struct RsaKeyPair {
    public_key: String,
    private_key: String,
}

#[tauri::command]
pub fn generate_rsa_keypair(bits: usize) -> Result<RsaKeyPair, String> {
    let mut rng = OsRng;

    let private_key =
        RsaPrivateKey::new(&mut rng, bits).map_err(|e| format!("生成密钥失败: {:?}", e))?;
    let public_key = RsaPublicKey::from(&private_key);

    let private_key_pem = private_key
        .to_pkcs8_pem(LineEnding::LF)
        .map_err(|e| format!("导出私钥失败: {:?}", e))?;

    let public_key_pem = public_key
        .to_pkcs1_pem(LineEnding::LF)
        .map_err(|e| format!("导出公钥失败: {:?}", e))?;

    Ok(RsaKeyPair {
        public_key: public_key_pem.to_string(),
        private_key: private_key_pem.to_string(),
    })
}

#[tauri::command]
pub fn generate_random_key(length: usize) -> String {
    let key: Vec<u8> = (0..length).map(|_| rand::random::<u8>()).collect();
    hex::encode(key)
}
