import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmployerContact } from "@/types/employerCRM";
import { ContactRoleBadge } from "./ContactRoleBadge";
import { Mail, Phone, Linkedin, Edit, Trash2, Star } from "lucide-react";

interface ContactCardProps {
  contact: EmployerContact;
  onEdit: () => void;
  onDelete: () => void;
  onSetPrimary: () => void;
}

export function ContactCard({ contact, onEdit, onDelete, onSetPrimary }: ContactCardProps) {
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{contact.firstName} {contact.lastName}</h4>
                {contact.isPrimary && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Primary
                  </Badge>
                )}
              </div>
              {contact.title && (
                <p className="text-sm text-muted-foreground">{contact.title}</p>
              )}
              {contact.department && (
                <p className="text-xs text-muted-foreground">{contact.department}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <a 
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <Mail className="h-4 w-4 text-muted-foreground" />
            {contact.email}
          </a>
          
          {contact.phone && (
            <a 
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              {contact.phone}
            </a>
          )}
          
          {contact.linkedInUrl && (
            <a 
              href={contact.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:underline text-blue-600"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn Profile
            </a>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {contact.roles.map(role => (
            <ContactRoleBadge key={role} role={role} />
          ))}
        </div>
        
        {contact.notes && (
          <p className="text-xs text-muted-foreground border-t pt-3">
            {contact.notes}
          </p>
        )}
        
        <div className="flex gap-2 border-t pt-3">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
          {!contact.isPrimary && (
            <Button variant="outline" size="sm" onClick={onSetPrimary}>
              <Star className="h-3 w-3 mr-1" />
              Set Primary
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
