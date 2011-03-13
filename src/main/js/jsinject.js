
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
/**
 * Dependency injection and IoC container for plain JavaScript.
 *<p>
 *Enables wiring of an application or IoC container from an application context
 *configuration.
 *</p>
 *<pre>
 * JSInject.wireBeans({
 *    foo : {type : FooClass},
 *    bar : {type : BarClass}
 * });
 * var foo = JSInject.getBean('foo');
 * var bar = JSInject.getBean('bar');
 *</pre>
 * 
 * @author Olle Törnström olle[at]studiomediatech[dot]com
 * @contributor ArtemM https://github.com/ArtemM
 * @created 2009-01-30
 * @version 1.0
 */
var JSInject = {};
(function (JSInject) {
	var Bean = function (definition) {
		this.type = definition.type;
		this.args = definition.args || [];
		this.props = definition.props || {};
		this.scope = (/(prototype|singleton)/).test(definition.scope) ? definition.scope : "singleton";
		return this;
	};
	Bean.prototype.wire = function (instance, context) {
		for (var p in this.props || {}) {
			var def = this.props[p];
			if (typeof def.ref !== "undefined") {
				instance[p] = context.instances[def.ref] || context.getBean(def.ref);
			} else {
				if (typeof def.type !== "undefined") {
					def.scope = "prototype";
					def.props = {};
					var innerBean = new Bean(def);
					var innerInstance = innerBean.getInstance();
					innerBean.wire(innerInstance, context);
					instance[p] = innerInstance;
				}
			}
		}
	};
	Bean.prototype.getInstance = function () {
		var obj = new this.type();
		this.type.apply(obj, this.args);
		return obj;
	};
	var ApplicationContext = function (config) {
		this.beans = {};
		this.instances = {};
		for (var n in config || {}) {
			var definition = config[n];
			var bean = new Bean(definition);
			this.beans[n] = bean;
			if (bean.scope === "singleton") {
				this.instances[n] = bean.getInstance();
			}
		}
		for (var i in this.instances) {
			var instance = this.instances[i];
			this.beans[i].wire(instance, this);
		}
		return this;
	};
	ApplicationContext.prototype.getBean = function (id) {
		if (typeof this.beans[id] === "undefined") {
			return undefined;
		}
		if (this.beans[id].scope === "prototype") {
			var instance = this.beans[id].getInstance(true);
			this.beans[id].wire(instance, this);
			return instance;
		}
		return this.instances[id];
	};
	var applicationContext = {};
	JSInject.wireBeans = function (config) {
		applicationContext = new ApplicationContext(config);
	};
	JSInject.getBean = function (name) {
		return applicationContext.getBean(name);
	};
})(JSInject);

