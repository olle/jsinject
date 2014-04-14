JSInject
========
 
 JSInject is a dependency injection library and an IoC (Inversion of Control) 
 container for JavaScript. It has no dependencies to other JavaScript libraries
 or frameworks.
 
## Features:
 
  - Application context (IoC container)
  - Bean wiring factory
  - Constructor arguments
  - Support for bean properties
  - Referenced bean properties
  - Inner (anonymous) bean properties
  - Supports bean scopes
  - Singleton bean scope (default)
  - Prototype bean scope

### Quick Guide

#### Usage:
 
Beans can be wired from a JSON bean configuration.
 
    JSInject.wireBeans({
      foo : {
 	     type : FooClass, 
 	     args : ['arg1', 'arg2'],
 	     props : {
 	       'myBar' : {ref : 'bar'}
 	     }
      },
      bar : {
 	     type : BarClass, 
 	     props : {
 		   'myBaz' : {type : BazClass}
 	     }
      }
    });
  
And referred to in the application context by unique name.
  
    var foo = JSInject.getBean('foo');
    var bar = JSInject.getBean('bar');

More information can be found in the project documentation.
 
### Developer Information

##### Using Ant
 
JSInject uses Ant and distributed binary dependencies to aid simple development and extension if anyone would like so. Ant 1.7.x or higher is preferred, and tested, but earlier versions such as 1.6.x might work as well.
 
To see available targets please use:
 
    ant -p
 
#### Requirements
 
Other requirements should at the moment only be a well functioning shelle, and running Java 1.5 or higher.
 
#### Testing
 	
Testing is an important part of further development and to ensure that JSInject works as expected. Please find time to enhance and further develop the unit tests for JSUnit.
 
Tests are currently in:
 
    ./src/test/js/jsinjectTest.js

### License

See the `LICENSE` file.