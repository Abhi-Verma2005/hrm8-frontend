import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, User } from "lucide-react";

interface EntityAvatarProps {
  src?: string;
  name: string;
  type?: 'logo' | 'person';
  size?: 'sm' | 'md' | 'lg';
}

export function EntityAvatar({ src, name, type = 'person', size = 'md' }: EntityAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${type === 'logo' ? 'rounded-lg' : 'rounded-full'}`}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className={`${getBackgroundColor(name)} text-white`}>
        {type === 'logo' ? (
          <Building2 className="h-4 w-4" />
        ) : src ? (
          getInitials(name)
        ) : (
          <User className="h-4 w-4" />
        )}
        {!src && getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
