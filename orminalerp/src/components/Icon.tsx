import {
  BarChart3,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  Car,
  Factory,
  GraduationCap,
  Hammer,
  Heart,
  Landmark,
  Receipt,
  Rocket,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  UserRound,
  Users,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

const registry: Record<string, LucideIcon> = {
  BarChart3,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  Car,
  Factory,
  GraduationCap,
  Hammer,
  Heart,
  Landmark,
  Receipt,
  Rocket,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  UserRound,
  Users,
  UtensilsCrossed,
  Wrench,
};

/** Renders a registered lucide icon by name, falling back to a neutral glyph. */
export function Icon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = registry[name] ?? Boxes;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden />;
}
