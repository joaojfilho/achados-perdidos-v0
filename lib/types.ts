export interface ItemBase {
  id: string
  nomeItem: string
  descricao: string
  categoria: string
  local: string
  data: string
  nomeContato: string
  telefone: string
  email: string
  observacoes: string
  criadoEm: string
}

export interface ItemPerdido extends ItemBase {
  tipo: "perdido"
}

export interface ItemEncontrado extends ItemBase {
  tipo: "encontrado"
  localEncontrado: string
  dataEncontrada: string
  localGuardado: string
}

export type Item = ItemPerdido | ItemEncontrado

export interface FormDataPerdido {
  nomeItem: string
  descricao: string
  categoria: string
  local: string
  data: string
  nomeContato: string
  telefone: string
  email: string
  observacoes: string
}

export interface FormDataEncontrado {
  nomeItem: string
  descricao: string
  categoria: string
  localEncontrado: string
  dataEncontrada: string
  localGuardado: string
  nomeContato: string
  telefone: string
  email: string
  observacoes: string
}
