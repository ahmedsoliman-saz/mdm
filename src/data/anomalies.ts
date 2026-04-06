import type { Anomaly } from '../types';

export const anomalies: Anomaly[] = [
  {
    id: 'AN-0001',
    entityType: 'spare-parts',
    anomalyType: 'Volume Spike',
    severity: 'High',
    detectedAt: '2026-04-05T14:30:00Z',
    affectedRecordCount: 87,
    status: 'New',
    description:
      'Detected a 340% increase in new spare part records ingested from SAP ERP in the last 24 hours compared to the 30-day rolling average. This may indicate a bulk import error or an unplanned data migration.',
    affectedRecordIds: ['SP-001480', 'SP-001481', 'SP-001482', 'SP-001483', 'SP-001484'],
  },
  {
    id: 'AN-0002',
    entityType: 'vendors',
    anomalyType: 'Duplicate Surge',
    severity: 'High',
    detectedAt: '2026-04-04T09:15:00Z',
    affectedRecordCount: 14,
    status: 'Investigating',
    description:
      'Matching engine identified 14 potential duplicate vendor records created within the last 48 hours. Most originate from the Excel Uploads source and appear to be re-entries of existing SAP vendors.',
    affectedRecordIds: ['V-1011', 'V-1014', 'V-1020', 'V-1021', 'V-1022'],
  },
  {
    id: 'AN-0003',
    entityType: 'spare-parts',
    anomalyType: 'Cost Outlier',
    severity: 'High',
    detectedAt: '2026-04-03T16:45:00Z',
    affectedRecordCount: 5,
    status: 'New',
    description:
      'Five spare part records show unit costs exceeding 3 standard deviations from their category mean. The most extreme is SP-001350 (Fire Suppression Valve) at $12,450 vs. category average of $2,100.',
    affectedRecordIds: ['SP-001350', 'SP-001089', 'SP-001275', 'SP-001150', 'SP-001420'],
  },
  {
    id: 'AN-0004',
    entityType: 'equipment',
    anomalyType: 'Missing Values Increase',
    severity: 'Medium',
    detectedAt: '2026-04-03T11:00:00Z',
    affectedRecordCount: 22,
    status: 'New',
    description:
      'The percentage of equipment records with missing "Install Date" has increased from 3% to 18% over the past week. Most affected records were recently synced from the AMOS source system.',
    affectedRecordIds: ['EQ-1040', 'EQ-1041', 'EQ-1042', 'EQ-1045', 'EQ-1050'],
  },
  {
    id: 'AN-0005',
    entityType: 'spare-parts',
    anomalyType: 'Distribution Shift',
    severity: 'Medium',
    detectedAt: '2026-04-02T08:20:00Z',
    affectedRecordCount: 38,
    status: 'Investigating',
    description:
      'The distribution of DQ scores for spare parts has shifted leftward — median dropped from 82 to 71 over the past 7 days. This correlates with a batch of 38 records imported from Excel Uploads with incomplete manufacturer data.',
    affectedRecordIds: ['SP-001500', 'SP-001510', 'SP-001520', 'SP-001030', 'SP-001067'],
  },
  {
    id: 'AN-0006',
    entityType: 'vendors',
    anomalyType: 'Schema Drift',
    severity: 'Medium',
    detectedAt: '2026-04-01T13:50:00Z',
    affectedRecordCount: 8,
    status: 'Investigating',
    description:
      'The Vendor Portal API started returning a new field "sustainability_rating" not present in the current field mapping. 8 vendor records have data in this unmapped field that is being silently dropped.',
    affectedRecordIds: ['V-1003', 'V-1005', 'V-1009', 'V-1013', 'V-1015'],
  },
  {
    id: 'AN-0007',
    entityType: 'equipment',
    anomalyType: 'Timeliness Drop',
    severity: 'Medium',
    detectedAt: '2026-03-30T10:30:00Z',
    affectedRecordCount: 45,
    status: 'Resolved',
    description:
      'Equipment records from AMOS showed a 72-hour sync delay due to a connectivity issue. 45 records had stale data during this period. Issue resolved after AMOS database connection was restored.',
    affectedRecordIds: ['EQ-1005', 'EQ-1008', 'EQ-1012', 'EQ-1015', 'EQ-1022'],
  },
  {
    id: 'AN-0008',
    entityType: 'spare-parts',
    anomalyType: 'Completeness Drop',
    severity: 'Low',
    detectedAt: '2026-03-28T15:10:00Z',
    affectedRecordCount: 12,
    status: 'Dismissed',
    description:
      'Twelve spare part records are missing the optional "Assigned Steward" field. Review determined this is expected for newly created records that have not yet been triaged.',
    affectedRecordIds: ['SP-001234', 'SP-001456', 'SP-001100', 'SP-001200', 'SP-001320'],
  },
  {
    id: 'AN-0009',
    entityType: 'vendors',
    anomalyType: 'Completeness Drop',
    severity: 'Low',
    detectedAt: '2026-03-25T09:00:00Z',
    affectedRecordCount: 3,
    status: 'New',
    description:
      'Three vendor records imported via Excel are missing the "Certification" field. These vendors (V-1025, V-1026, V-1027) were recently onboarded and require manual enrichment.',
    affectedRecordIds: ['V-1025', 'V-1026', 'V-1011', 'V-1014', 'V-1020'],
  },
  {
    id: 'AN-0010',
    entityType: 'equipment',
    anomalyType: 'Duplicate Surge',
    severity: 'Low',
    detectedAt: '2026-03-22T14:00:00Z',
    affectedRecordCount: 6,
    status: 'Resolved',
    description:
      'Six equipment records flagged as potential duplicates after a re-sync from AMOS. Investigation confirmed these were legitimately distinct units on different vessels with similar names.',
    affectedRecordIds: ['EQ-1025', 'EQ-1026', 'EQ-1030', 'EQ-1035', 'EQ-1055'],
  },
];
