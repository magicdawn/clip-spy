use clipboard_win::{formats, get_clipboard, set_clipboard};
use napi::bindgen_prelude::Buffer;

pub fn clear() {
  // TODO: impl this
}

pub fn get(format: String) -> () {
  // pub fn get(format: String) -> Buffer {
  // TODO: impl this
}

pub fn set(format: String, data: Buffer) -> () {
  // pub fn set(format: String, data: Buffer) -> bool {
  // TODO: impl this
}

//
// doc https://github.com/DoumanAsh/clipboard-win
// example
//
// let text = "my sample ><";
// set_clipboard(formats::Unicode, text).expect("To set clipboard");
// //Type is necessary as string can be stored in various storages
// let result: String = get_clipboard(formats::Unicode).expect("To set clipboard");
// assert_eq!(result, text)
