import type { Draft } from '../types';

export const drafts: Draft[] = [
  {
    id: 'DR-0001',
    entityType: 'spare-parts',
    recordId: 'SP-000012',
    recordDescription: 'Marine Diesel Engine Oil Filter',
    changes: [
      { attribute: 'Manufacturer', before: 'Parker Hannifin', after: 'Donaldson Filtration' },
      { attribute: 'Unit Cost (USD)', before: '124.50', after: '118.75' },
      { attribute: 'Lead Time (days)', before: '14', after: '10' },
    ],
    createdAt: '2025-04-03T09:30:00Z',
    createdBy: 'u-001',
  },
  {
    id: 'DR-0002',
    entityType: 'vendors',
    recordId: 'V-1008',
    recordDescription: 'Alfa Laval AB',
    changes: [
      { attribute: 'Payment Terms', before: 'Net 15', after: 'Net 60' },
      { attribute: 'Contact Email', before: 'info@alfalaval.se', after: 'marine.orders@alfalaval.com' },
    ],
    createdAt: '2025-04-02T14:15:00Z',
    createdBy: 'u-002',
  },
  {
    id: 'DR-0003',
    entityType: 'equipment',
    recordId: 'EQ-0045',
    recordDescription: 'Ballast Water Treatment System',
    changes: [
      { attribute: 'Status', before: 'Operational', after: 'Decommissioned' },
      { attribute: 'Decommission Date', before: '(none)', after: '2025-04-15' },
      { attribute: 'Location', before: 'Deck 3 — Water Treatment Room', after: 'Removed — Awaiting Disposal' },
    ],
    createdAt: '2025-04-04T07:45:00Z',
    createdBy: 'u-004',
  },
  {
    id: 'DR-0004',
    entityType: 'spare-parts',
    recordId: 'SP-000048',
    recordDescription: 'Centrifugal Purifier Disc Stack',
    changes: [
      { attribute: 'Manufacturer', before: '(blank)', after: 'Alfa Laval' },
      { attribute: 'Category', before: 'Uncategorized', after: 'Purifier Components' },
      { attribute: 'Critical Spare', before: 'No', after: 'Yes' },
      { attribute: 'Unit Cost (USD)', before: '1,200.00', after: '1,350.00' },
    ],
    createdAt: '2025-04-05T10:00:00Z',
    createdBy: 'u-001',
  },
  {
    id: 'DR-0005',
    entityType: 'vendors',
    recordId: 'V-1019',
    recordDescription: 'MAN Energy Solutions',
    changes: [
      { attribute: 'Certification', before: 'ISO 9001 (exp. 2025-03-31)', after: 'ISO 9001 (renewed 2025-04-10, exp. 2028-04-10)' },
      { attribute: 'Status', before: 'Under Review', after: 'Approved' },
    ],
    createdAt: '2025-04-05T16:30:00Z',
    createdBy: 'u-003',
  },
];
