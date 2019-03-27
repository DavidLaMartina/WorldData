// var dataVars = {
//   TOTPOP: "Total Population",
//   TOTMALES: "Total Male Population",
//   TOTFEMALES: "Total Female Population",
//   TOTHH: "Total Households",
//   AVGHHSZ: "Average Household Size",
//   PPPC_CY: "Purchasing Power per Capita",
//   PPIDX_CY: "Purchasing Power Index",
//   'EDUC05_CY': "Education Level 4 Qualifications and Above",
//   AVGHINC_CY: "Average Household Income (US)"
// };

/*
  Each key in the dataVars dictionary includes a representative string (name)
  and a set of potential keys, given that data point's reference for various
  parts of the world in the ESRI demographics database. Those keys will
  ultimatley be cycled through to find one that's non-null.
*/

var dataVars = {
  totpop: {
    keys: ['TOTPOP'],
    name: "Total population"
  },
  totmales: {
    keys: ['TOTMALES'],
    name: "Total males"
  },
  totfemales: {
    keys: ['TOTFEMALES'],
    name: "Total females"
  },
  tothouseholds: {
    keys: ['TOTHH'],
    name: "Total households"
  },
  avghouseholdsize: {
    keys: ['AVGHHSZ'],
    name: "Average household size"
  },
  purchasingpower: {
    keys: ['PPIDX_CY'],
    name: "Purchasing power index"
  },
  income: {
    keys: ['AVGHINC_CY', ],
    name: "Average Household Income"
  },
  education: {
    keys: ['EDUC06_CY', 'BACHDEG_CY'],
    name: "Post-secondary Education"
  }
};
