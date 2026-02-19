function parseDataISO(dataISO) {
  if (typeof dataISO !== "string") return null;
  const formato = /^\d{4}-\d{2}-\d{2}$/;
  if (!formato.test(dataISO.trim())) return null;

  const data = new Date(`${dataISO}T00:00:00`);
  return Number.isNaN(data.getTime()) ? null : data;
}

function diasParaValidade(dataISO) {
  const dataValidade = parseDataISO(dataISO);
  if (!dataValidade) return null;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
}

export function obterStatusValidade(dataISO) {                                                                      
  const dias = diasParaValidade(dataISO);

  if (dias === null) {
    return { tipo: "invalido", texto: "DATA INVALIDA", cor: "#64748B" };
  }

  if (dias < 0) {
    return { tipo: "vencido", texto: "VENCIDO", cor: "#DC2626" };
  }

  if (dias <= 7) {
    return { tipo: "proximo", texto: "PROXIMO", cor: "#CA8A04" };
  }

  return { tipo: "ok", texto: "OK", cor: "#16A34A" };
}

export function validarDataISO(dataISO) {
  return parseDataISO(dataISO) !== null;
}

export function ordenarPorValidade(produtos) {
  return [...produtos].sort((a, b) => {
    const diaA = diasParaValidade(a.validade);
    const diaB = diasParaValidade(b.validade);

    if (diaA === null && diaB === null) return 0;
    if (diaA === null) return 1;
    if (diaB === null) return -1;
    return diaA - diaB;
  });
}
