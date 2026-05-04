import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCompatibleYear(startDateField: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCompatibleYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [startDateField],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [startDateFieldName] = args.constraints;
          const startDateValue = (args.object as any)[startDateFieldName];

          if (!value || !startDateValue) return true; // se algum estiver vazio, não valida

          const startDate = new Date(startDateValue);
          const ano = Number(value);

          if (isNaN(ano)) return false;

          const startYear = startDate.getFullYear();

          // aceita apenas startYear -1, startYear ou startYear +1
          return ano >= startYear - 1 && ano <= startYear + 1;
        },
        defaultMessage(args: ValidationArguments) {
          const [startDateFieldName] = args.constraints;
          return `${args.property} deve ser no mesmo ano de ${startDateFieldName} ou pelo menos 1 ano antes ou depois.`;
        },
      },
    });
  };
}