export interface SearchQueryCase {
  id: string;
  query: string;
  description: string;
  expectResults: boolean;
  minResultCount?: number;
}

export const SearchQueries = {
  validPartNumber: '1K0615301AA',
  validGeneric: 'brake pad',
  invalidSqlLike: "' OR '1'='1",
  empty: '',
  nonsense: 'zzzznonexistentpart99999',
} as const;

export const defaultSearchCases: SearchQueryCase[] = [
  {
    id: 'valid-part',
    query: SearchQueries.validPartNumber,
    description: 'OEM-style part number should return catalog matches',
    expectResults: true,
    minResultCount: 1,
  },
  {
    id: 'valid-generic',
    query: SearchQueries.validGeneric,
    description: 'Generic term should surface relevant products',
    expectResults: true,
    minResultCount: 1,
  },
  {
    id: 'nonsense-term',
    query: SearchQueries.nonsense,
    description: 'Unknown term should not fabricate misleading product hits',
    expectResults: false,
  },
];
