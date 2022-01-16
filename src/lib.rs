#![deny(clippy::all)]
#![allow(dead_code)]

#[macro_use]
extern crate napi_derive;
#[macro_use]
extern crate objc;

use clipboard_macos::Clipboard;
use napi::bindgen_prelude::*;
use once_cell::sync::OnceCell;

mod clip_bridge;

fn init_clip() -> &'static mut Clipboard {
  static mut CLIP: OnceCell<Clipboard> = OnceCell::new();
  unsafe {
    if CLIP.get_mut().is_none() {
      assert!(CLIP.set(Clipboard::new().unwrap()).is_ok());
    }
    CLIP.get_mut().unwrap()
  }
}

#[napi]
fn clip_read() -> String {
  // let clip = Clipboard::new().unwrap();
  // clip.read().unwrap()
  init_clip().read().unwrap()
}

#[napi]
fn clip_write(s: String) -> () {
  // let mut clip = Clipboard::new().unwrap();
  // clip.write(s).unwrap()
  init_clip().write(s).unwrap()
}

#[napi]
fn mozjpeg_test(width: u32, height: u32, buf: Buffer) -> Buffer {
  let mut comp = mozjpeg::Compress::new(mozjpeg::ColorSpace::JCS_EXT_RGBA);

  comp.set_size(width as usize, height as usize);
  comp.set_mem_dest();
  comp.start_compress();

  // replace with your image data
  let pixels: Vec<u8> = buf.into();
  // vec![0; width * height * 3];
  assert!(comp.write_scanlines(&pixels[..]));

  comp.finish_compress();
  let jpeg_bytes = comp.data_to_vec().unwrap();

  Buffer::from(jpeg_bytes)
}

#[napi]
fn test() -> Buffer {
  let c = clip_bridge::Clipboard::new().unwrap();
  let data = c.data_for_type("public.utf8-plain-text");
  Buffer::from(data)
}

#[napi]
fn test2(format: String, data: Buffer) {
  let c = clip_bridge::Clipboard::new().unwrap();
  c.set_data(&format, data.to_vec());
}
