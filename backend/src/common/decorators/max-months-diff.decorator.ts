import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function MaxMonthsDiff(startDateField: string, maxMonths: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxMonthsDiff',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [startDateField, maxMonths],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [startDateFieldName, maxMonthsConstraint] = args.constraints;
          const startDateValue = (args.object as any)[startDateFieldName];

          if (!value || !startDateValue) return true; // se algum campo estiver vazio, não valida

          const startDate = new Date(startDateValue);
          const endDate = new Date(value);

          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;

          // calcula diferença em meses
          const monthsDiff =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());

          return monthsDiff <= maxMonthsConstraint;
        },
        defaultMessage(args: ValidationArguments) {
          const [startDateFieldName, maxMonthsConstraint] = args.constraints;
          return `${args.property} não pode ser mais de ${maxMonthsConstraint} meses após ${startDateFieldName}.`;
        },
      },
    });
  };
}