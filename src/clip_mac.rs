use napi::bindgen_prelude::Buffer;
use objc::runtime::Object;
use objc_foundation::{INSArray, INSData, INSString};
use objc_foundation::{NSArray, NSData, NSString};
use objc_id::Id;
use once_cell::sync::OnceCell;
use std::error::Error;

// required to bring NSPasteboard into the path of the class-resolver
#[link(name = "AppKit", kind = "framework")]
extern "C" {}

#[allow(non_camel_case_types)]
pub type id = *mut Object;
#[allow(non_upper_case_globals)]
pub const nil: id = 0 as id;

#[allow(non_snake_case)]
fn get_general_pasteboard() -> Result<Id<Object>, Box<dyn Error>> {
  let NSPasteboard = class!(NSPasteboard);
  let generalPasteboard: *mut Object = unsafe { msg_send![NSPasteboard, generalPasteboard] };
  if generalPasteboard.is_null() {
    return Err("NSPasteboard#generalPasteboard returned null".into());
  }
  let pasteboard: Id<Object> = unsafe { Id::from_ptr(generalPasteboard) };
  Ok(pasteboard)
}
pub struct Clipboard {
  pasteboard: Id<Object>,
}

impl Clipboard {
  pub fn new() -> Result<Clipboard, Box<dyn Error>> {
    Ok(Clipboard {
      pasteboard: get_general_pasteboard()?,
    })
  }

  pub fn clear_contents(&self) {
    unsafe { msg_send![self.pasteboard, clearContents] }
  }

  pub fn data_for_type(&self, format: &str) -> Vec<u8> {
    let obj: *mut NSData =
      unsafe { msg_send![self.pasteboard, dataForType: NSString::from_str(format)] };
    let data: Id<NSData> = unsafe { Id::from_ptr(obj) };
    let data = data.bytes().to_vec();
    data
  }

  pub fn set_data(&self, format: &str, data: Vec<u8>) -> bool {
    // [NSPasteboard.generalPasteboard declareTypes:@[ format ] owner:nil] -> NSInteger;
    let reciver_new_change_count: isize = unsafe {
      msg_send![self.pasteboard, declareTypes:NSArray::from_vec(vec![NSString::from_str(format)]) owner:nil]
    };
    // don't know this means? for now
    if cfg!(debug_assertions) {
      println!("declareTypes return value = {}", reciver_new_change_count);
    }

    // BOOL success = [NSPasteboard.generalPasteboard setData:data forType:format];
    let success: bool = unsafe {
      msg_send![self.pasteboard, setData:NSData::from_vec(data) forType:NSString::from_str(format)]
    };
    success
  }
}

fn get_clip() -> &'static Clipboard {
  static mut CLIP: OnceCell<Clipboard> = OnceCell::new();
  unsafe { CLIP.get_or_init(|| Clipboard::new().unwrap()) }
}

pub fn clear() {
  get_clip().clear_contents();
}

pub fn get(format: String) -> Buffer {
  let data = get_clip().data_for_type(&format);
  Buffer::from(data)
}

pub fn set(format: String, data: Buffer) -> bool {
  get_clip().set_data(&format, data.to_vec())
}
