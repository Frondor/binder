export interface Container {}

export interface Resolvable {
  new (container: Container): unknown
  injects?: Array<unknown>
}
