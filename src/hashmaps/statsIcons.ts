import {
  Sword,
  PersonSimpleRun,
  Shield,
  MagicWand,
  Barbell,
  FirstAid,
  GenderIntersex,
  Brain,
  IconProps,
} from 'phosphor-react-native';

const statsIcons: {
  [key: string]: ({
    weight,
    color,
    size,
    style,
    mirrored,
  }: IconProps) => JSX.Element;
} = {
  sword: Sword,
  personSimpleRun: PersonSimpleRun,
  shield: Shield,
  magicWand: MagicWand,
  barbell: Barbell,
  firstAid: FirstAid,
  genderIntersex: GenderIntersex,
  brain: Brain,
};

export default statsIcons;
