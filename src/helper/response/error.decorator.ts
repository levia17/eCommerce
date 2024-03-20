import 'reflect-metadata';

export const HandleError = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    const methodMetadataKeys = Reflect.getOwnMetadataKeys(originalMethod);

    for (const key of methodMetadataKeys) {
        const value = Reflect.getOwnMetadata(key, originalMethod);
        Reflect.defineMetadata(key, value, descriptor.value);
    }

    descriptor.value = async function (...arg: any[]) {
        const response = await originalMethod.apply(this, arg)
            .then(data => console.log(`Success in ${propertyKey} with value is ${arg}`))
            .catch(err => console.log(`Failed in ${propertyKey} with value is ${arg}`))
        return response;

    }

    return descriptor;
}

export function HandleErrorFactory() {
    return function (constructor: Function) {
        Object.getOwnPropertyNames(constructor.prototype).forEach((methodName) => {
            // Don't wrap the constructor
            if (methodName !== 'constructor') {
                const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, methodName);

                // Check if the property is a method
                if (descriptor && typeof descriptor.value === 'function') {
                    // Apply the method decorator
                    Object.defineProperty(
                        constructor.prototype,
                        methodName,
                        HandleError(constructor.prototype, methodName, descriptor) || descriptor
                    );
                }
            }
        });
    };
}
