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

/**
 * windows only functions
 */

#[cfg(target_os = "windows")]
mod clip_win;
