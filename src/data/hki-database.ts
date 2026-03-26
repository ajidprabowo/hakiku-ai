// ══════════════════════════════════════════════════════════════
// HAKIKU — Database PDKI DJKI
// src/data/hki-database.ts
//
// Sumber: Database_HKI_Terdaftar.xlsx
// Total: 57 entri dari database PDKI resmi
// ══════════════════════════════════════════════════════════════

import type { HKIRecord } from '@/types';

export const HKI_DATABASE: HKIRecord[] = [
  { no:'1',  nama:'pay4it dan logo',                    tipe:'TM', status:'Didaftar',                   nomor:'JID2021008338',     kelas:'36',          deskripsi:'jasa keuangan, transfer dana elektronik melalui jaringan komputer...',                pemilik:'Blackhawk Network, Inc.' },
  { no:'2',  nama:'Wúxiàn shénsù zhǎn (Huruf Kanji)',  tipe:'TM', status:'Didaftar',                   nomor:'DID2021010892',     kelas:'41, 9',       deskripsi:'distribusi film, hiburan permainan komputer secara online...',                        pemilik:'Kabushiki Kaisha Square Enix' },
  { no:'3',  nama:'UKG Our purpose is people and Device',tipe:'TM',status:'Didaftar',                   nomor:'DID2021011014',     kelas:'35, 42, 9',   deskripsi:'layanan konsultasi bisnis, manajemen sumber daya manusia...',                        pemilik:'UKG Inc.' },
  { no:'4',  nama:'uni canggu',                         tipe:'TM', status:'Didaftar',                   nomor:'JID2019065098',     kelas:'43',          deskripsi:'hotel, motel, restoran, bar dan layanan katering...',                               pemilik:'HERAWAN KOSWARA' },
  { no:'5',  nama:'COZY',                               tipe:'TM', status:'Didaftar',                   nomor:'D002010028257',     kelas:'1',           deskripsi:'Pupuk',                                                                             pemilik:'PT PIJAR NUSA PASIFIK' },
  { no:'6',  nama:'VITA TETRA CHLOR',                   tipe:'TM', status:'Didaftar',                   nomor:'D002010018055',     kelas:'5',           deskripsi:'Obat untuk hewan',                                                                  pemilik:'PT MEDION FARMA JAYA' },
  { no:'7',  nama:'Savoni',                             tipe:'TM', status:'Didaftar',                   nomor:'D002010033839',     kelas:'11',          deskripsi:'Sipon washtafel, shower set, kran air, perlengkapan kamar mandi',                   pemilik:'EKA WIRANTO TANTYO' },
  { no:'8',  nama:'REDONES',                            tipe:'TM', status:'Didaftar',                   nomor:'DID2021084105',     kelas:'10',          deskripsi:'perangkat medis',                                                                   pemilik:'Ridwan Saleh' },
  { no:'9',  nama:'BPR',                                tipe:'TM', status:'Didaftar',                   nomor:'DID2021014063',     kelas:'1',           deskripsi:'addif pertanian',                                                                   pemilik:'PT BESTARI PUTRA RAJAWAL' },
  { no:'10', nama:'Stately Mode',                       tipe:'TM', status:'Didaftar',                   nomor:'DID2021084177',     kelas:'25',          deskripsi:'pakaian laki-laki, perempuan, baju bayi...',                                        pemilik:'Gitto Octoulia' },
  { no:'11', nama:'Neurafarm',                          tipe:'TM', status:'Didaftar',                   nomor:'J002021084133',     kelas:'44',          deskripsi:'jasa informasi dan konsultasi pertanian, agribisnis...',                            pemilik:'FEBI ADIL IFDILLAH' },
  { no:'12', nama:'Lobstech',                           tipe:'TM', status:'Didaftar',                   nomor:'DID2021084080',     kelas:'9',           deskripsi:'alat pengontrol otomatis dan monitor untuk keperluan industri...',                  pemilik:'Hendika' },
  { no:'13', nama:'Vidio',                              tipe:'TM', status:'Didaftar',                   nomor:'MID2023500034',     kelas:'41',          deskripsi:'layanan streaming video online',                                                    pemilik:'PT VIDIO DOT COM' },
  { no:'14', nama:'FLIMTY',                             tipe:'TM', status:'Didaftar',                   nomor:'M002020000035',     kelas:'5',           deskripsi:'minuman suplemen, food supplement, formulasi minuman bubuk...',                     pemilik:'PT ANUGERAH INOVASI MAKMUR' },
  { no:'15', nama:'BRT BINTANG RACING TEAM',            tipe:'TM', status:'Didaftar',                   nomor:'M002022050012',     kelas:'9',           deskripsi:'akumulator, alat instalasi jaringan...',                                           pemilik:'PT TRI MINTARI NIAGA' },
  { no:'16', nama:'GUESS USA WASHED JEANS',             tipe:'TM', status:'Didaftar',                   nomor:'M002020010082',     kelas:'25',          deskripsi:'pakaian, baju laki-laki, perempuan, bayi...',                                       pemilik:'Guess?, Inc.' },
  { no:'17', nama:'FRUITY',                             tipe:'TM', status:'Didaftar',                   nomor:'R002006009974',     kelas:'3',           deskripsi:'esensintik, wangi-wangian, minyak wangi, sabun...',                                 pemilik:'LIM DLI AI' },
  { no:'18', nama:'PINUFERT',                           tipe:'TM', status:'Didaftar',                   nomor:'R002010023066',     kelas:'1',           deskripsi:'Pupuk majemuk lepas terkendali untuk pertanian',                                    pemilik:'PIJAR NUSA PASIFIK' },
  { no:'19', nama:'DOUBLE HAPPINESS',                   tipe:'TM', status:'Didaftar',                   nomor:'V002008007726',     kelas:'43',          deskripsi:'Restoran',                                                                          pemilik:'CANDRA MARKUS' },
  { no:'20', nama:'VIRANOX',                            tipe:'TM', status:'Didaftar',                   nomor:'M002021088727',     kelas:'5',           deskripsi:'farmasetika, sediaan formulasi, suplemen makanan...',                               pemilik:'NEW MADE INTERNATIONAL' },
  { no:'21', nama:'OBAGI CLINICAL',                     tipe:'TM', status:'Didaftar',                   nomor:'M002021077430A',    kelas:'3, 35',       deskripsi:'produk perawatan kulit, sun block, kosmetik...',                                    pemilik:'Obagi Holdings Company' },
  { no:'22', nama:'SOLO',                               tipe:'TM', status:'Didaftar',                   nomor:'M002010037142',     kelas:'10',          deskripsi:'alat resuisatif, alat pengukur darah, peralatan medis...',                          pemilik:'MEDICAL TECHNOLOGIES Ltd' },
  { no:'23', nama:'FM WORLD',                           tipe:'TM', status:'Didaftar',                   nomor:'M002021850045',     kelas:'3, 5',        deskripsi:'pewangian, parfum, kosmetik, produk kebersihan...',                                 pemilik:'FM World Sp. z o.o.' },
  { no:'24', nama:'Giorgione',                          tipe:'TM', status:'Didaftar',                   nomor:'M002021690403',     kelas:'16, 2',       deskripsi:'alat menggambar, bahan menggambar, kertas, pastel...',                              pemilik:'Lewu Yang' },
  { no:'25', nama:'LINGUALEO',                          tipe:'TM', status:'Didaftar',                   nomor:'M002021088166',     kelas:'38, 41',      deskripsi:'layanan telekomunikasi, komunikasi melalui jaringan komputer...',                   pemilik:'LINGUALEO CYPRUS LIMITED' },
  { no:'26', nama:'gonoturn',                           tipe:'TM', status:'Didaftar',                   nomor:'M002021446D0A',     kelas:'10',          deskripsi:'peralatan sanitasi untuk keperluan medis',                                          pemilik:'CENO COMPANY LTD' },
  { no:'27', nama:'GIVAUDAN',                           tipe:'TM', status:'Didaftar',                   nomor:'M002020788753',     kelas:'3, 5',        deskripsi:'parfum, lotion, sun block, produk pewangian...',                                    pemilik:'Givaudan SA' },
  { no:'28', nama:'SpiderPlus',                         tipe:'TM', status:'Didaftar',                   nomor:'M002021602658',     kelas:'35, 41',      deskripsi:'layanan periklanan, pemasaran internet...',                                         pemilik:'SpiderPlus & Co.' },
  { no:'29', nama:'Clair',                              tipe:'TM', status:'Didaftar',                   nomor:'M002021969836B',    kelas:'11',          deskripsi:'filter peralatan listrik, kipas angin listrik...',                                  pemilik:'CLAIR, Inc.' },
  { no:'30', nama:'FEDERICO MAHORA PURE',               tipe:'TM', status:'Didaftar',                   nomor:'M002021610584',     kelas:'3, 35',       deskripsi:'air toilet wangi, diffuser aromaterapi, parfum...',                                 pemilik:'FM World Sp. z o.o.' },
  { no:'31', nama:'UTIQUE',                             tipe:'TM', status:'Didaftar',                   nomor:'M002021618202',     kelas:'3, 4',        deskripsi:'air bunga, parfum, kosmetik perawatan...',                                          pemilik:'FM World Sp. z o.o.' },
  { no:'32', nama:'SHEMAR',                             tipe:'TM', status:'Didaftar',                   nomor:'M002021606775',     kelas:'19, 6',       deskripsi:'bahan bangunan, bahan pengikat untuk perbaikan...',                                 pemilik:'JIANGSU SHEMAR ELECTRIC' },
  { no:'33', nama:'SOLECTA',                            tipe:'TM', status:'Didaftar',                   nomor:'M002021602903',     kelas:'11, 17',      deskripsi:'aparatus filtrasi membran polimer untuk industri...',                               pemilik:'SOLECTA, INC.' },
  { no:'34', nama:'GrabFin',                            tipe:'TM', status:'Didaftar',                   nomor:'M002023163256A',    kelas:'35, 36',      deskripsi:'administrasi bisnis, layanan keuangan digital...',                                  pemilik:'GrabTaxi Holdings Pte. Ltd.' },
  { no:'35', nama:'LD PORTS & LOGISTICS',               tipe:'TM', status:'Didaftar',                   nomor:'J002009038032',     kelas:'39',          deskripsi:'angkutan barang dan penumpang dalam dan luar negeri...',                            pemilik:'PACEMAR' },
  { no:'36', nama:'FLYING BOAT',                        tipe:'TM', status:'Didaftar',                   nomor:'R0A2009004285',     kelas:'28',          deskripsi:'kartu main, kartu domino, kartu remi',                                              pemilik:'PT. SUPARMA' },
  { no:'37', nama:'NOORE / APPLECOAST',                 tipe:'TM', status:'Pemeriksa Substantif 1',     nomor:'MID2020000247',     kelas:'25',          deskripsi:'Gamis, khimar syari modern, baju couple...',                                        pemilik:'PT. Bersama Adi Prakarsa' },
  { no:'38', nama:'POPEYES',                            tipe:'TM', status:'Pelayanan Teknis',            nomor:'MTI2023000025',     kelas:'43',          deskripsi:'restoran, layanan bawa pulang, pengantaran...',                                     pemilik:'Popeyes Louisiana Kitchen' },
  { no:'39', nama:'Nuartha Tour and event',             tipe:'TM', status:'Masa Pengumuman (BRM)',       nomor:'JID2025010356',     kelas:'39, 41',      deskripsi:'jasa perjalanan wisata, pemesanan perjalanan...',                                   pemilik:'Raymon Pramasta' },
  { no:'40', nama:'Robuxshopind',                       tipe:'TM', status:'Masa Pengumuman (BRM)',       nomor:'DID2025010469',     kelas:'28',          deskripsi:'peralatan video game',                                                              pemilik:'Rahmat Nur Hadi' },
  { no:'41', nama:'KOMO KOFFIE',                        tipe:'TM', status:'Masa Pengumuman (BRM)',       nomor:'DID2025010263',     kelas:'30, 43',      deskripsi:'minuman kopi, kakao, teh dengan berbagai varian...',                                pemilik:'Vincentius Erick K. Mere' },
  { no:'42', nama:'Untitled Eatery',                    tipe:'TM', status:'Masa Pengumuman (BRM)',       nomor:'DID2025010358',     kelas:'30',          deskripsi:'makaroni, kue kering',                                                              pemilik:'Muhammad Khotibul Umam' },
  { no:'43', nama:'Toko Teh Sumber Harum',              tipe:'TM', status:'Masa Pengumuman (BRM)',       nomor:'DID2025010219',     kelas:'30, 43',      deskripsi:'minuman teh',                                                                       pemilik:'Bartolomeus Adhika Bayu' },
];

/**
 * Cari merek di database PDKI berdasarkan kata kunci
 * @param query - kata kunci pencarian
 * @returns array hasil yang cocok (maks 10)
 */
export function searchHKIDatabase(query: string): {
  matches: HKIRecord[];
  exactConflicts: HKIRecord[];
  total: number;
} {
  if (!query || query.length < 2) {
    return { matches: [], exactConflicts: [], total: 0 };
  }

  const q = query.toLowerCase().trim();

  const matches = HKI_DATABASE.filter(d =>
    d.nama.toLowerCase().includes(q)
  ).slice(0, 10);

  const exactConflicts = HKI_DATABASE.filter(d =>
    d.nama.toLowerCase() === q ||
    d.nama.toLowerCase().startsWith(q)
  );

  return {
    matches,
    exactConflicts,
    total: HKI_DATABASE.filter(d => d.nama.toLowerCase().includes(q)).length,
  };
}

/**
 * Hitung estimasi peluang lolos pendaftaran
 */
export function calculateLolosPct(matchCount: number, hasExact: boolean): number {
  if (matchCount === 0) return 88;
  if (hasExact) return 32;
  return 62;
}
