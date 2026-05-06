import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBefore(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBefore',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) return true; // não valida se algum estiver vazio
          
          const startDate = new Date(value);
          const endDate = new Date(relatedValue);

          return startDate < endDate;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} deve ser anterior a ${relatedPropertyName}`;
        },
      },
    });
  };
}