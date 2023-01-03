const keysOfStore = [
  'id',
  'name',
  'address',
  'latitude',
  'longitude',
  'status',
  'schedules',
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validationSaveMasterdata(data: any) {
  new Validator(data)
    .isObject()
    .isRequired()
    .containKeys(['city', 'store'], 'request')
  new Validator(data.store)
    .containKeys(keysOfStore, 'store')
    .isBoolean(data.store.status, 'status en store')
  new Validator(data.store.schedules)
    .isArray()
    .isLength(1, 7)
    .structureArray(['dayOfWeek', 'openingTime', 'closingTime'])
}

class Validator {
  private value: any

  private errors: string[] = []

  constructor(value: any) {
    this.value = value
  }

  public isNumber(key: string | null = null) {
    const value = key ? this.value[key] : this.value

    if (typeof value !== 'number')
      // throw new Error('El valor no es un numero')
      this.errors.push('El valor no es un numero')

    return this
  }

  public isString() {
    if (typeof this.value !== 'string')
      // throw new Error('El valor no es un string')
      this.errors.push('El valor no es un string')

    return this
  }

  public isBoolean(_value: any, name: string) {
    const value = _value || this.value

    if (typeof value !== 'boolean')
      this.errors.push(`El ${name} no es un booleano`)

    return this
  }

  public isObject() {
    if (typeof this.value !== 'object')
      // throw new Error('El valor no es un object')
      this.errors.push('El valor no es un object')

    return this
  }

  public isArray() {
    if (!Array.isArray(this.value))
      // throw new Error('El valor no es un array')
      this.errors.push('El valor no es un array')

    return this
  }

  public isRequired() {
    if (!this.value)
      // throw new Error('El valor es requerido')
      this.errors.push('El valor es requerido')

    return this
  }

  public isEmail() {
    if (!this.value.includes('@'))
      // throw new Error('El valor no es un email')
      this.errors.push('El valor no es un email')

    return this
  }

  public containKeys(keys: string[], name: string) {
    keys.forEach((key) => {
      if (!this.value[key])
        // throw new Error(`El valor de ${name} no posee la propiedad ${key}`)
        this.errors.push(`El valor de ${name} no posee la propiedad ${key}`)
    })

    return this
  }

  public isLength(min: number, max: number) {
    if (this.value.length < min || this.value.length > max)
      throw new Error(`El valor debe tener entre ${min} y ${max} caracteres`)

    return this
  }

  public structureArray(keys: string[]) {
    this.value.forEach((element: any) => {
      new Validator(element).containKeys(keys, 'schedule')
    })

    return this
  }

  public isDate(_value: any, name = 'fecha') {
    const value = _value || this.value

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Date.parse(this.value)))
      throw new Error(`El ${name} no es una fecha`)

    return this
  }

  public isDatesArray(_value: any, name: string) {}
}
