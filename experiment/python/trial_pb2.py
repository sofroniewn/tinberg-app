# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: trial.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
from google.protobuf import descriptor_pb2
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='trial.proto',
  package='trial',
  syntax='proto2',
  serialized_pb=_b('\n\x0btrial.proto\x12\x05trial\"\x15\n\x04\x44\x61ta\x12\r\n\x05trial\x18\x01 \x02(\x05')
)
_sym_db.RegisterFileDescriptor(DESCRIPTOR)




_DATA = _descriptor.Descriptor(
  name='Data',
  full_name='trial.Data',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='trial', full_name='trial.Data.trial', index=0,
      number=1, type=5, cpp_type=1, label=2,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  options=None,
  is_extendable=False,
  syntax='proto2',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=22,
  serialized_end=43,
)

DESCRIPTOR.message_types_by_name['Data'] = _DATA

Data = _reflection.GeneratedProtocolMessageType('Data', (_message.Message,), dict(
  DESCRIPTOR = _DATA,
  __module__ = 'trial_pb2'
  # @@protoc_insertion_point(class_scope:trial.Data)
  ))
_sym_db.RegisterMessage(Data)


# @@protoc_insertion_point(module_scope)