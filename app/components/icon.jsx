import * as Icons from "lucide-react";

export default function Icon({ icon, ...props }) {
  const IconComp = Icons[icon] ?? Icons.AlertTriangle;

  return <IconComp {...props} />;
}
