const keysOfStore = [
  'id',
  'name',
  'address',
  'latitude',
  'longitude',
  'status',
  'schedules',
]

export function validationSaveMasterdata(data: any) {
  new Validator(data)
    .isObject('', 'store')
    .isString('city')
    .containKeys(['city', 'store'], 'request')
    .changeValue(data.store)
    // .get()
    // new Validator(data.store)
    .isArray('schedules')
    .containKeys(keysOfStore, 'store')
    .isString('id', 'name', 'address', 'latitude', 'longitude')
    .isBoolean('status')
    .structureArray(['dayOfWeek', 'openingTime', 'closingTime'], 'schedules')
    .changeValue(data.store.schedules)
    //   .get()
    // new Validator(data.store.schedules)
    .isLength(1, 7)
    .get()
}

class Validator {
  private errors: string[] = []

  constructor(private value: any, private name: string = 'value') {}

  public changeValue(value: unknown): Validator {
    this.value = value

    return this
  }

  public isNumber(...keys: string[]): Validator {
    return this.valuesType(TypeValue.number, ...keys)
  }

  public isString(...keys: string[]): Validator {
    return this.valuesType(TypeValue.string, ...keys)
  }

  public isBoolean(...keys: string[]): Validator {
    return this.valuesType(TypeValue.boolean, ...keys)
  }

  public isObject(...keys: string[]): Validator {
    return this.valuesType(TypeValue.object, ...keys)
  }

  public isArray(...keys: string[]): Validator {
    return this.valuesType(TypeValue.array, ...keys)
  }

  public isRequired(...keys: string[]): Validator {
    if (keys.length === 0) {
      if (!this.value) this.errors.push(`El valor ${this.name} es requerido`)

      return this
    }

    keys.forEach((key) => {
      if (!this.value[key]) this.errors.push(`El valor ${key} es requerido`)
    })

    return this
  }

  public isEmail(key = '') {
    const value = this.getValue(key)

    if (typeof value !== 'string') {
      this.errors.push(`El valor ${key} no es un email valido`)

      return this
    }

    if (!value.includes('@')) this.errors.push(`El valor ${key} no es un email`)

    return this
  }

  public containKeys(keys: string[], name: string) {
    const value = this.getValue()

    // eslint-disable-next-line no-prototype-builtins
    if (typeof value === 'object') {
      keys.forEach((key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!value?.hasOwnProperty(key))
          this.errors.push(`El valor de ${name} no posee la propiedad ${key}`)
      })

      return this
    }

    this.errors.push(`El valor ${name} no se puede validar no es un objeto`)

    return this
  }

  public isLength(min: number, max: number, key = '') {
    const value = this.getValue(key)

    if (!Array.isArray(value)) {
      this.errors.push(`El valor ${key} no es un array`)

      return this
    }

    if (value.length < min || value.length > max)
      this.errors.push(
        `El valor ${key} debe tener entre ${min} y ${max} caracteres`
      )

    return this
  }

  public structureArray(keys: string[], key = '') {
    const value = this.getValue(key)

    if (Array.isArray(value)) {
      value.forEach((element: unknown) => {
        keys.forEach((key1) => {
          // eslint-disable-next-line no-prototype-builtins
          if (typeof element !== 'object' || !element?.hasOwnProperty(key1))
            this.errors.push(
              `El valor ${key} a verificar su estructura no posee la propiedad ${key1}`
            )
        })
      })

      return this
    }

    this.errors.push(`El valor ${key} a verificar su estructura no es un array`)

    return this
  }

  public get() {
    if (this.errors.length > 0) {
      throw new Error(this.errors.join(', \n'))
    }
  }

  private getValue(key = ''): unknown {
    return key !== '' ? this.value[key] : this.value
  }

  private valuesType(type: TypeValue, ...keys: string[]) {
    if (keys.length === 0) {
      this.valueType(type)

      return this
    }

    keys.forEach((key) => {
      this.valueType(type, key)
    })

    return this
  }

  private valueType(type: TypeValue, key = '') {
    const value = this.getValue(key)

    if (type === TypeValue.array) {
      if (!Array.isArray(value)) {
        this.errors.push(`El valor ${key} no es un array`)
      }

      return this
    }

    if (typeof value !== type) {
      this.errors.push(`El valor ${key} no es un ${type}`)
    }

    return this
  }
}

export const enum TypeValue {
  number = 'number',
  string = 'string',
  boolean = 'boolean',
  object = 'object',
  array = 'array',
}

const StringsValidators = {
  number: (value: string) => `${value} no es un number`,
  string: (value: string) => `${value} no es un string`,
  boolean: (value: string) => `${value} no es un boolean`,
  object: (value: string) => `${value} no es un object`,
}
