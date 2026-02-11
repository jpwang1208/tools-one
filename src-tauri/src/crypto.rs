use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, BlockEncryptMut, KeyIvInit};
use base64::{engine::general_purpose::STANDARD, Engine as _};

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
    let digest = md5::compute(text.as_bytes());
    hex::encode(digest.as_slice())
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

use p256::{
    ecdh::EphemeralSecret,
    elliptic_curve::ecdh::diffie_hellman,
    pkcs8::{DecodePublicKey, EncodePublicKey},
    PublicKey, SecretKey,
};

#[derive(serde::Serialize)]
pub struct EccKeyPair {
    public_key: String,
    private_key: String,
}

#[tauri::command]
pub fn generate_ecc_keypair() -> Result<EccKeyPair, String> {
    let secret_key = SecretKey::random(&mut OsRng);
    let public_key = secret_key.public_key();

    let private_key_pem = secret_key
        .to_pkcs8_pem(LineEnding::LF)
        .map_err(|e| format!("导出私钥失败: {:?}", e))?;

    let public_key_pem = public_key
        .to_public_key_pem(LineEnding::LF)
        .map_err(|e| format!("导出公钥失败: {:?}", e))?;

    Ok(EccKeyPair {
        public_key: public_key_pem.to_string(),
        private_key: private_key_pem.to_string(),
    })
}

fn derive_key_from_shared_secret(shared_secret: &[u8]) -> ([u8; 32], [u8; 16]) {
    let mut hasher = Sha256::new();
    hasher.update(shared_secret);
    let hash = hasher.finalize();

    let mut key = [0u8; 32];
    let mut iv = [0u8; 16];
    key.copy_from_slice(&hash[..32]);
    iv.copy_from_slice(&hash[16..32]);

    (key, iv)
}

#[tauri::command]
pub fn ecc_encrypt(text: &str, public_key_pem: &str) -> Result<String, String> {
    let public_key = PublicKey::from_public_key_pem(public_key_pem)
        .map_err(|e| format!("解析公钥失败: {:?}", e))?;

    let ephemeral_secret = EphemeralSecret::random(&mut OsRng);
    let ephemeral_public = ephemeral_secret.public_key();

    let shared_secret = ephemeral_secret.diffie_hellman(&public_key);
    let (key, iv) = derive_key_from_shared_secret(shared_secret.raw_secret_bytes());

    let cipher = Aes256CbcEnc::new(&key.into(), &iv.into());
    let mut buffer = vec![0u8; text.len() + 16];

    let encrypted = cipher
        .encrypt_padded_b2b_mut::<Pkcs7>(text.as_bytes(), &mut buffer)
        .map_err(|e| format!("加密失败: {:?}", e))?;

    let ephemeral_public_bytes = ephemeral_public.to_sec1_bytes();
    let result = format!(
        "{}.{}",
        STANDARD.encode(ephemeral_public_bytes.as_ref()),
        STANDARD.encode(encrypted)
    );

    Ok(result)
}

#[tauri::command]
pub fn ecc_decrypt(encrypted_text: &str, private_key_pem: &str) -> Result<String, String> {
    let parts: Vec<&str> = encrypted_text.split('.').collect();
    if parts.len() != 2 {
        return Err("无效的加密格式".to_string());
    }

    let ephemeral_public_bytes = STANDARD
        .decode(parts[0])
        .map_err(|e| format!("解码临时公钥失败: {:?}", e))?;

    let encrypted_data = STANDARD
        .decode(parts[1])
        .map_err(|e| format!("解码密文失败: {:?}", e))?;

    let ephemeral_public = PublicKey::from_sec1_bytes(&ephemeral_public_bytes)
        .map_err(|e| format!("解析临时公钥失败: {:?}", e))?;

    let secret_key =
        SecretKey::from_pkcs8_pem(private_key_pem).map_err(|e| format!("解析私钥失败: {:?}", e))?;

    let shared_secret =
        diffie_hellman(secret_key.to_nonzero_scalar(), ephemeral_public.as_affine());
    let (key, iv) = derive_key_from_shared_secret(shared_secret.raw_secret_bytes());

    let cipher = Aes256CbcDec::new(&key.into(), &iv.into());
    let mut buffer = vec![0u8; encrypted_data.len()];

    let decrypted = cipher
        .decrypt_padded_b2b_mut::<Pkcs7>(&encrypted_data, &mut buffer)
        .map_err(|e| format!("解密失败: {:?}", e))?;

    String::from_utf8(decrypted.to_vec()).map_err(|e| format!("UTF-8 解码失败: {:?}", e))
}
