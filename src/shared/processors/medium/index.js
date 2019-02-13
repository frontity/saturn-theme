import anchor from './anchor';
import tzGallery from './tzGallery';
import dmGallery from './dmGallery';
import myrGallery from './myrGallery';
import myrTiledGallery from './myrTiledGallery';
import infogram from './infogram';
import { textCounter, injectSlot } from './injectSlots';

export default [
  injectSlot,
  textCounter,
  anchor,
  tzGallery,
  dmGallery,
  myrGallery,
  myrTiledGallery,
  infogram,
];
