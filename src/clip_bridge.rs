use objc::runtime::{Class, Object};
use objc_foundation::{INSArray, INSData, INSString};
use objc_foundation::{NSArray, NSData, NSString};
use objc_id::Id;
use std::error::Error;
use std::mem::transmute;

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
    //
    //
    // TODO: 这里报错了, nil 怎么写都报错
    // nil 报错
    // std::ptr::null::<usize>() 报错
    //
    // [NSPasteboard.generalPasteboard declareTypes:@[ format ] owner:nil];
    unsafe {
      // msg_send![self.pasteboard, declareTypes: NSString::from_str(format) owner: std::ptr::null::<usize>()]
    }

    // BOOL success = [NSPasteboard.generalPasteboard setData:data forType:format];
    let success: bool = unsafe {
      msg_send![self.pasteboard, setData: NSData::from_vec(data) forType: NSString::from_str(format)]
    };
    success
  }

  pub fn write(&mut self, data: String) -> Result<(), Box<dyn Error>> {
    let string_array = NSArray::from_vec(vec![NSString::from_str(&data)]);
    let _: usize = unsafe { msg_send![self.pasteboard, clearContents] };
    let success: bool = unsafe { msg_send![self.pasteboard, writeObjects: string_array] };
    return if success {
      Ok(())
    } else {
      Err("NSPasteboard#writeObjects: returned false".into())
    };
  }
}

// this is a convenience function that both cocoa-rs and
//  glutin define, which seems to depend on the fact that
//  Option::None has the same representation as a null pointer
#[inline]
pub fn class(name: &str) -> *mut Class {
  unsafe { transmute(Class::get(name)) }
}
