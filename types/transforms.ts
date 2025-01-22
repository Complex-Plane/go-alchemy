type Rotation = 0 | 90 | 180 | 270;
type Reflection = 'none' | 'horizontal' | 'vertical' | 'diagonal';
type ColorInversion = boolean;

interface BoardTransformation {
  rotation: Rotation;
  reflection: Reflection;
  invertColors: ColorInversion;
}

export { Rotation, Reflection, ColorInversion, BoardTransformation };
