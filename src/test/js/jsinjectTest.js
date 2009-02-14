
/*
 * Copyright (c) 2008-2009 Olle Törnström studiomediatech.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// TESTCLASSES

var Foo = function (name) {
	this.name = name || 'Foo';
};
Foo.prototype.getName = function () {
	return this.name;
};
var Bar = function (name) {
	this.name = name || 'Bar';
};
Bar.prototype.getName = function () {
	return this.name;
};

// TESTS

var JSInjectTest = {};

JSInjectTest.setUp = function () {
	JSInject.wireBeans({
		foo : {type : Foo},
		bar : {type : Bar},
		namedFoo : {type : Foo, args : ['NamedFoo']},
		namedBar : {type : Bar, args : ['NamedBar']},
		wiredFoo : {
			type : Foo, 
			args : ['WiredFoo'],
			props : {
				'myBar' : {ref : 'bar'}
			}
		},
		wiredBar : {
			type : Bar,
			args : ['WiredBar'],
			props : {
				'myFoo' : {type : Foo, args : ['InnerFoo']},
				'myBar' : {ref : 'bar'}
			}
		}
	});
};

JSInjectTest.testGetBean = function () {
	assertNotNull(JSInject.getBean("foo"));
	assertNotNull(JSInject.getBean("bar"));
};

JSInjectTest.testGetUndefinedBean = function () {
	assertEquals(undefined, JSInject.getBean("baz"));
};

JSInjectTest.testGetNamedBean = function () {
	assertEquals('NamedFoo', JSInject.getBean('namedFoo').getName());
	assertEquals('NamedBar', JSInject.getBean('namedBar').getName());
	assertEquals('Foo', JSInject.getBean('foo').getName());
	assertEquals('Bar', JSInject.getBean('bar').getName());
};

JSInjectTest.testGetWiredProperty = function () {
	assertEquals('Bar', JSInject.getBean('wiredFoo').myBar.getName());
};

JSInjectTest.testGetInnerBeanProperty = function () {
	assertEquals('InnerFoo', JSInject.getBean('wiredBar').myFoo.getName());
};

TestCase.JSInjectTest = JSInjectTest;

