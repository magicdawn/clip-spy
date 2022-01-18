#![deny(clippy::all)]
#![allow(dead_code)]

#[macro_use]
extern crate napi_derive;
#[macro_use]
extern crate objc;

use napi::bindgen_prelude::*;
use once_cell::sync::OnceCell;

mod ns_pasteboard;
use ns_pasteboard::Clipboard;

fn get_clip() -> &'static Clipboard {
  static mut CLIP: OnceCell<Clipboard> = OnceCell::new();
  unsafe { CLIP.get_or_init(|| Clipboard::new().unwrap()) }
}

#[napi]
fn clear() {
  get_clip().clear_contents();
}

#[napi]
fn get(format: String) -> Buffer {
  let data = get_clip().data_for_type(&format);
  Buffer::from(data)
}

#[napi]
fn set(format: String, data: Buffer) -> bool {
  get_clip().set_data(&format, data.to_vec())
}
