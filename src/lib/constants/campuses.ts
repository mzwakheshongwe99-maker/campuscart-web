import { University, Campus } from '@/types';

export const INITIAL_UNIVERSITIES: University[] = [
  { id: 'cput', name: 'Cape Peninsula University of Technology', code: 'CPUT' },
  { id: 'uct', name: 'University of Cape Town', code: 'UCT' },
  { id: 'uwc', name: 'University of the Western Cape', code: 'UWC' },
  { id: 'su', name: 'Stellenbosch University', code: 'SU' },
];

export const INITIAL_CAMPUSES: Campus[] = [
  // CPUT
  {
    id: 'cput-bellville',
    universityId: 'cput',
    universityName: 'CPUT',
    name: 'CPUT Bellville Campus',
    code: 'CPUT-BEL',
    lat: -33.9315,
    lng: 18.6288,
    deliveryLocations: [
      { id: 'loc-1', campusId: 'cput-bellville', name: 'Bellville Library Entrance', isPopular: true },
      { id: 'loc-2', campusId: 'cput-bellville', name: 'Bellville IT Lab / Computer Lab Foyer', isPopular: true },
      { id: 'loc-3', campusId: 'cput-bellville', name: 'Bellville Student Centre', isPopular: true },
      { id: 'loc-4', campusId: 'cput-bellville', name: 'Bellville Main Gate / Security' },
      { id: 'loc-5', campusId: 'cput-bellville', name: 'Engineering Quad' },
    ],
  },
  {
    id: 'cput-district-six',
    universityId: 'cput',
    universityName: 'CPUT',
    name: 'CPUT District Six Campus',
    code: 'CPUT-D6',
    lat: -33.9252,
    lng: 18.4223,
    deliveryLocations: [
      { id: 'loc-6', campusId: 'cput-district-six', name: 'District Six Library Entrance', isPopular: true },
      { id: 'loc-7', campusId: 'cput-district-six', name: 'Commerce Building Foyer', isPopular: true },
      { id: 'loc-8', campusId: 'cput-district-six', name: 'D6 Student Centre Cafeteria', isPopular: true },
      { id: 'loc-9', campusId: 'cput-district-six', name: 'Administration Building Plaza' },
    ],
  },
  {
    id: 'cput-mowbray',
    universityId: 'cput',
    universityName: 'CPUT',
    name: 'CPUT Mowbray Campus',
    code: 'CPUT-MOW',
    lat: -33.9469,
    lng: 18.4782,
    deliveryLocations: [
      { id: 'loc-10', campusId: 'cput-mowbray', name: 'Education Building Entrance', isPopular: true },
      { id: 'loc-11', campusId: 'cput-mowbray', name: 'Mowbray Student Centre' },
    ],
  },
  // UCT
  {
    id: 'uct-upper',
    universityId: 'uct',
    universityName: 'UCT',
    name: 'UCT Upper Campus',
    code: 'UCT-UPP',
    lat: -33.9576,
    lng: 18.4614,
    deliveryLocations: [
      { id: 'loc-12', campusId: 'uct-upper', name: 'Jagger Library Steps / Plaza', isPopular: true },
      { id: 'loc-13', campusId: 'uct-upper', name: 'Computer Science Building Foyer', isPopular: true },
      { id: 'loc-14', campusId: 'uct-upper', name: 'Menzies Building Courtyard', isPopular: true },
      { id: 'loc-15', campusId: 'uct-upper', name: 'Leslie Social Science Lawn' },
      { id: 'loc-16', campusId: 'uct-upper', name: 'Sports Centre Reception' },
    ],
  },
  {
    id: 'uct-middle',
    universityId: 'uct',
    universityName: 'UCT',
    name: 'UCT Middle Campus',
    code: 'UCT-MID',
    lat: -33.9546,
    lng: 18.4636,
    deliveryLocations: [
      { id: 'loc-17', campusId: 'uct-middle', name: 'Kramer Law Building Entrance', isPopular: true },
      { id: 'loc-18', campusId: 'uct-middle', name: 'Middle Campus Library Point' },
    ],
  },
  {
    id: 'uct-medical',
    universityId: 'uct',
    universityName: 'UCT',
    name: 'UCT Health Sciences Campus',
    code: 'UCT-MED',
    lat: -33.9415,
    lng: 18.4704,
    deliveryLocations: [
      { id: 'loc-19', campusId: 'uct-medical', name: 'Medical School Library Entrance', isPopular: true },
      { id: 'loc-20', campusId: 'uct-medical', name: 'Anatomy Building Courtyard' },
    ],
  },
  // UWC
  {
    id: 'uwc-main',
    universityId: 'uwc',
    universityName: 'UWC',
    name: 'UWC Main Campus Bellville',
    code: 'UWC-MAIN',
    lat: -33.9332,
    lng: 18.6288,
    deliveryLocations: [
      { id: 'loc-21', campusId: 'uwc-main', name: 'UWC Main Library Steps', isPopular: true },
      { id: 'loc-22', campusId: 'uwc-main', name: 'Student Centre Food Court', isPopular: true },
      { id: 'loc-23', campusId: 'uwc-main', name: 'Computer Science Science Quad' },
      { id: 'loc-24', campusId: 'uwc-main', name: 'Hector Peterson Residence Gate' },
    ],
  },
  // Stellenbosch University
  {
    id: 'su-main',
    universityId: 'su',
    universityName: 'Stellenbosch University',
    name: 'Stellenbosch Main Campus',
    code: 'SU-STELL',
    lat: -33.9340,
    lng: 18.8641,
    deliveryLocations: [
      { id: 'loc-25', campusId: 'su-main', name: 'Neelsie Student Centre Entrance', isPopular: true },
      { id: 'loc-26', campusId: 'su-main', name: 'JS Gericke Library Plaza / Rooiplein', isPopular: true },
      { id: 'loc-27', campusId: 'su-main', name: 'Engineering Faculty Courtyard' },
      { id: 'loc-28', campusId: 'su-main', name: 'Admin B Lawn' },
    ],
  },
  {
    id: 'su-tygerberg',
    universityId: 'su',
    universityName: 'Stellenbosch University',
    name: 'SU Tygerberg Campus',
    code: 'SU-TYG',
    lat: -33.9094,
    lng: 18.5951,
    deliveryLocations: [
      { id: 'loc-29', campusId: 'su-tygerberg', name: 'Tygerberg Student Centre Entrance', isPopular: true },
      { id: 'loc-30', campusId: 'su-tygerberg', name: 'Medical Library Foyer' },
    ],
  },
];
