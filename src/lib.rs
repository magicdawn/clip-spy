#![deny(clippy::all)]

use napi::bindgen_prelude::Buffer;

#[macro_use]
extern crate napi_derive;

/**
 * mac only functions
 */

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

#[cfg(target_os = "macos")]
mod clip_mac;

#[napi]
pub fn mac_clear() {
  clip_mac::clear()
}

#[napi]
pub fn mac_get(format: String) -> Buffer {
  clip_mac::get(format)
}

#[napi]
pub fn mac_set(format: String, data: Buffer) -> bool {
  clip_mac::set(format, data)
}

/**
 * windows only functions
 */

#[cfg(target_os = "windows")]
mod clip_win;
