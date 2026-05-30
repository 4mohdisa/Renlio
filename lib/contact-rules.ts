import type { ContactType } from '@/types'

// Which types are incompatible with each role
const INCOMPATIBLE_TYPES: Record<ContactType, ContactType[]> = {
  TENANT: ['OWNER', 'SUPPLIER'],
  OWNER: ['TENANT', 'SUPPLIER'],
  SUPPLIER: ['TENANT', 'OWNER'],
  OTHER: [],
}

/**
 * Returns true if a contact with existingType can be assigned to targetRole
 */
export function isRoleCompatible(
  existingType: ContactType,
  targetRole: ContactType
): boolean {
  if (existingType === 'OTHER') return true
  if (existingType === targetRole) return true
  return !INCOMPATIBLE_TYPES[targetRole].includes(existingType)
}

/**
 * Returns a human-readable error message when a contact cannot be assigned
 */
export function getRoleConflictMessage(
  existingType: ContactType,
  targetRole: ContactType
): string {
  const roleLabels: Record<ContactType, string> = {
    TENANT: 'a tenant',
    OWNER: 'an owner',
    SUPPLIER: 'a supplier',
    OTHER: 'a contact',
  }
  return `This contact is already assigned as ${roleLabels[existingType]} and cannot be used as ${roleLabels[targetRole]}.`
}

/**
 * Filters a list of contacts to only those compatible with the target role
 * Used in ContactForm select mode to only show valid options
 */
export function filterCompatibleContacts<T extends { type: ContactType }>(
  contacts: T[],
  targetRole: ContactType
): T[] {
  return contacts.filter((c) => isRoleCompatible(c.type, targetRole))
}
