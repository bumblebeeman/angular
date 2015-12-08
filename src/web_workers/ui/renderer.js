'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('angular2/src/core/di');
var message_bus_1 = require('angular2/src/web_workers/shared/message_bus');
var serializer_1 = require('angular2/src/web_workers/shared/serializer');
var api_1 = require('angular2/src/core/render/api');
var api_2 = require('angular2/src/web_workers/shared/api');
var messaging_api_1 = require('angular2/src/web_workers/shared/messaging_api');
var bind_1 = require('./bind');
var event_dispatcher_1 = require('angular2/src/web_workers/ui/event_dispatcher');
var render_proto_view_ref_store_1 = require('angular2/src/web_workers/shared/render_proto_view_ref_store');
var render_view_with_fragments_store_1 = require('angular2/src/web_workers/shared/render_view_with_fragments_store');
var service_message_broker_1 = require('angular2/src/web_workers/shared/service_message_broker');
var MessageBasedRenderer = (function () {
    function MessageBasedRenderer(_brokerFactory, _bus, _serializer, _renderProtoViewRefStore, _renderViewWithFragmentsStore, _renderer) {
        this._brokerFactory = _brokerFactory;
        this._bus = _bus;
        this._serializer = _serializer;
        this._renderProtoViewRefStore = _renderProtoViewRefStore;
        this._renderViewWithFragmentsStore = _renderViewWithFragmentsStore;
        this._renderer = _renderer;
    }
    MessageBasedRenderer.prototype.start = function () {
        var broker = this._brokerFactory.createMessageBroker(messaging_api_1.RENDERER_CHANNEL);
        this._bus.initChannel(messaging_api_1.EVENT_CHANNEL);
        broker.registerMethod("registerComponentTemplate", [api_1.RenderComponentTemplate], bind_1.bind(this._renderer.registerComponentTemplate, this._renderer));
        broker.registerMethod("createProtoView", [serializer_1.PRIMITIVE, api_2.WebWorkerTemplateCmd, serializer_1.PRIMITIVE], bind_1.bind(this._createProtoView, this));
        broker.registerMethod("createRootHostView", [api_1.RenderProtoViewRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._createRootHostView, this));
        broker.registerMethod("createView", [api_1.RenderProtoViewRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._createView, this));
        broker.registerMethod("destroyView", [api_1.RenderViewRef], bind_1.bind(this._destroyView, this));
        broker.registerMethod("attachFragmentAfterFragment", [api_1.RenderFragmentRef, api_1.RenderFragmentRef], bind_1.bind(this._renderer.attachFragmentAfterFragment, this._renderer));
        broker.registerMethod("attachFragmentAfterElement", [api_2.WebWorkerElementRef, api_1.RenderFragmentRef], bind_1.bind(this._renderer.attachFragmentAfterElement, this._renderer));
        broker.registerMethod("detachFragment", [api_1.RenderFragmentRef], bind_1.bind(this._renderer.detachFragment, this._renderer));
        broker.registerMethod("hydrateView", [api_1.RenderViewRef], bind_1.bind(this._renderer.hydrateView, this._renderer));
        broker.registerMethod("dehydrateView", [api_1.RenderViewRef], bind_1.bind(this._renderer.dehydrateView, this._renderer));
        broker.registerMethod("setText", [api_1.RenderViewRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setText, this._renderer));
        broker.registerMethod("setElementProperty", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setElementProperty, this._renderer));
        broker.registerMethod("setElementAttribute", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setElementAttribute, this._renderer));
        broker.registerMethod("setElementClass", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setElementClass, this._renderer));
        broker.registerMethod("setElementStyle", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.setElementStyle, this._renderer));
        broker.registerMethod("invokeElementMethod", [api_2.WebWorkerElementRef, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._renderer.invokeElementMethod, this._renderer));
        broker.registerMethod("setEventDispatcher", [api_1.RenderViewRef], bind_1.bind(this._setEventDispatcher, this));
    };
    MessageBasedRenderer.prototype._destroyView = function (viewRef) {
        this._renderer.destroyView(viewRef);
        this._renderViewWithFragmentsStore.remove(viewRef);
    };
    MessageBasedRenderer.prototype._createProtoView = function (componentTemplateId, cmds, refIndex) {
        var protoViewRef = this._renderer.createProtoView(componentTemplateId, cmds);
        this._renderProtoViewRefStore.store(protoViewRef, refIndex);
    };
    MessageBasedRenderer.prototype._createRootHostView = function (ref, fragmentCount, selector, startIndex) {
        var renderViewWithFragments = this._renderer.createRootHostView(ref, fragmentCount, selector);
        this._renderViewWithFragmentsStore.store(renderViewWithFragments, startIndex);
    };
    MessageBasedRenderer.prototype._createView = function (ref, fragmentCount, startIndex) {
        var renderViewWithFragments = this._renderer.createView(ref, fragmentCount);
        this._renderViewWithFragmentsStore.store(renderViewWithFragments, startIndex);
    };
    MessageBasedRenderer.prototype._setEventDispatcher = function (viewRef) {
        var dispatcher = new event_dispatcher_1.EventDispatcher(viewRef, this._bus.to(messaging_api_1.EVENT_CHANNEL), this._serializer);
        this._renderer.setEventDispatcher(viewRef, dispatcher);
    };
    MessageBasedRenderer = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [service_message_broker_1.ServiceMessageBrokerFactory, message_bus_1.MessageBus, serializer_1.Serializer, render_proto_view_ref_store_1.RenderProtoViewRefStore, render_view_with_fragments_store_1.RenderViewWithFragmentsStore, api_1.Renderer])
    ], MessageBasedRenderer);
    return MessageBasedRenderer;
})();
exports.MessageBasedRenderer = MessageBasedRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvdWkvcmVuZGVyZXIudHMiXSwibmFtZXMiOlsiTWVzc2FnZUJhc2VkUmVuZGVyZXIiLCJNZXNzYWdlQmFzZWRSZW5kZXJlci5jb25zdHJ1Y3RvciIsIk1lc3NhZ2VCYXNlZFJlbmRlcmVyLnN0YXJ0IiwiTWVzc2FnZUJhc2VkUmVuZGVyZXIuX2Rlc3Ryb3lWaWV3IiwiTWVzc2FnZUJhc2VkUmVuZGVyZXIuX2NyZWF0ZVByb3RvVmlldyIsIk1lc3NhZ2VCYXNlZFJlbmRlcmVyLl9jcmVhdGVSb290SG9zdFZpZXciLCJNZXNzYWdlQmFzZWRSZW5kZXJlci5fY3JlYXRlVmlldyIsIk1lc3NhZ2VCYXNlZFJlbmRlcmVyLl9zZXRFdmVudERpc3BhdGNoZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUJBQXlCLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsNEJBQXlCLDZDQUE2QyxDQUFDLENBQUE7QUFDdkUsMkJBQW9DLDRDQUE0QyxDQUFDLENBQUE7QUFDakYsb0JBT08sOEJBQThCLENBQUMsQ0FBQTtBQUN0QyxvQkFBd0QscUNBQXFDLENBQUMsQ0FBQTtBQUM5Riw4QkFBOEMsK0NBQStDLENBQUMsQ0FBQTtBQUU5RixxQkFBbUIsUUFBUSxDQUFDLENBQUE7QUFDNUIsaUNBQThCLDhDQUE4QyxDQUFDLENBQUE7QUFDN0UsNENBQXNDLDZEQUE2RCxDQUFDLENBQUE7QUFDcEcsaURBRU8sa0VBQWtFLENBQUMsQ0FBQTtBQUMxRSx1Q0FBMEMsd0RBQXdELENBQUMsQ0FBQTtBQUVuRztJQUVFQSw4QkFBb0JBLGNBQTJDQSxFQUFVQSxJQUFnQkEsRUFDckVBLFdBQXVCQSxFQUN2QkEsd0JBQWlEQSxFQUNqREEsNkJBQTJEQSxFQUMzREEsU0FBbUJBO1FBSm5CQyxtQkFBY0EsR0FBZEEsY0FBY0EsQ0FBNkJBO1FBQVVBLFNBQUlBLEdBQUpBLElBQUlB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JztcbmltcG9ydCB7TWVzc2FnZUJ1c30gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdlX2J1cyc7XG5pbXBvcnQge1NlcmlhbGl6ZXIsIFBSSU1JVElWRX0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJpYWxpemVyJztcbmltcG9ydCB7XG4gIFJlbmRlclZpZXdSZWYsXG4gIFJlbmRlckZyYWdtZW50UmVmLFxuICBSZW5kZXJQcm90b1ZpZXdSZWYsXG4gIFJlbmRlcmVyLFxuICBSZW5kZXJUZW1wbGF0ZUNtZCxcbiAgUmVuZGVyQ29tcG9uZW50VGVtcGxhdGVcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVuZGVyL2FwaSc7XG5pbXBvcnQge1dlYldvcmtlckVsZW1lbnRSZWYsIFdlYldvcmtlclRlbXBsYXRlQ21kfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL2FwaSc7XG5pbXBvcnQge0VWRU5UX0NIQU5ORUwsIFJFTkRFUkVSX0NIQU5ORUx9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvbWVzc2FnaW5nX2FwaSc7XG5pbXBvcnQge1R5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge2JpbmR9IGZyb20gJy4vYmluZCc7XG5pbXBvcnQge0V2ZW50RGlzcGF0Y2hlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3VpL2V2ZW50X2Rpc3BhdGNoZXInO1xuaW1wb3J0IHtSZW5kZXJQcm90b1ZpZXdSZWZTdG9yZX0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9yZW5kZXJfcHJvdG9fdmlld19yZWZfc3RvcmUnO1xuaW1wb3J0IHtcbiAgUmVuZGVyVmlld1dpdGhGcmFnbWVudHNTdG9yZVxufSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3JlbmRlcl92aWV3X3dpdGhfZnJhZ21lbnRzX3N0b3JlJztcbmltcG9ydCB7U2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5fSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcnZpY2VfbWVzc2FnZV9icm9rZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWVzc2FnZUJhc2VkUmVuZGVyZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9icm9rZXJGYWN0b3J5OiBTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3RvcnksIHByaXZhdGUgX2J1czogTWVzc2FnZUJ1cyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfc2VyaWFsaXplcjogU2VyaWFsaXplcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcmVuZGVyUHJvdG9WaWV3UmVmU3RvcmU6IFJlbmRlclByb3RvVmlld1JlZlN0b3JlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9yZW5kZXJWaWV3V2l0aEZyYWdtZW50c1N0b3JlOiBSZW5kZXJWaWV3V2l0aEZyYWdtZW50c1N0b3JlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIpIHt9XG5cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgdmFyIGJyb2tlciA9IHRoaXMuX2Jyb2tlckZhY3RvcnkuY3JlYXRlTWVzc2FnZUJyb2tlcihSRU5ERVJFUl9DSEFOTkVMKTtcbiAgICB0aGlzLl9idXMuaW5pdENoYW5uZWwoRVZFTlRfQ0hBTk5FTCk7XG5cbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJyZWdpc3RlckNvbXBvbmVudFRlbXBsYXRlXCIsIFtSZW5kZXJDb21wb25lbnRUZW1wbGF0ZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIucmVnaXN0ZXJDb21wb25lbnRUZW1wbGF0ZSwgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJjcmVhdGVQcm90b1ZpZXdcIiwgW1BSSU1JVElWRSwgV2ViV29ya2VyVGVtcGxhdGVDbWQsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fY3JlYXRlUHJvdG9WaWV3LCB0aGlzKSk7XG4gICAgYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwiY3JlYXRlUm9vdEhvc3RWaWV3XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtSZW5kZXJQcm90b1ZpZXdSZWYsIFBSSU1JVElWRSwgUFJJTUlUSVZFLCBQUklNSVRJVkVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX2NyZWF0ZVJvb3RIb3N0VmlldywgdGhpcykpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcImNyZWF0ZVZpZXdcIiwgW1JlbmRlclByb3RvVmlld1JlZiwgUFJJTUlUSVZFLCBQUklNSVRJVkVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX2NyZWF0ZVZpZXcsIHRoaXMpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJkZXN0cm95Vmlld1wiLCBbUmVuZGVyVmlld1JlZl0sIGJpbmQodGhpcy5fZGVzdHJveVZpZXcsIHRoaXMpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJhdHRhY2hGcmFnbWVudEFmdGVyRnJhZ21lbnRcIiwgW1JlbmRlckZyYWdtZW50UmVmLCBSZW5kZXJGcmFnbWVudFJlZl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuYXR0YWNoRnJhZ21lbnRBZnRlckZyYWdtZW50LCB0aGlzLl9yZW5kZXJlcikpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcImF0dGFjaEZyYWdtZW50QWZ0ZXJFbGVtZW50XCIsIFtXZWJXb3JrZXJFbGVtZW50UmVmLCBSZW5kZXJGcmFnbWVudFJlZl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuYXR0YWNoRnJhZ21lbnRBZnRlckVsZW1lbnQsIHRoaXMuX3JlbmRlcmVyKSk7XG4gICAgYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwiZGV0YWNoRnJhZ21lbnRcIiwgW1JlbmRlckZyYWdtZW50UmVmXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5kZXRhY2hGcmFnbWVudCwgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJoeWRyYXRlVmlld1wiLCBbUmVuZGVyVmlld1JlZl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuaHlkcmF0ZVZpZXcsIHRoaXMuX3JlbmRlcmVyKSk7XG4gICAgYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwiZGVoeWRyYXRlVmlld1wiLCBbUmVuZGVyVmlld1JlZl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuZGVoeWRyYXRlVmlldywgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJzZXRUZXh0XCIsIFtSZW5kZXJWaWV3UmVmLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuc2V0VGV4dCwgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJzZXRFbGVtZW50UHJvcGVydHlcIiwgW1dlYldvcmtlckVsZW1lbnRSZWYsIFBSSU1JVElWRSwgUFJJTUlUSVZFXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50UHJvcGVydHksIHRoaXMuX3JlbmRlcmVyKSk7XG4gICAgYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwic2V0RWxlbWVudEF0dHJpYnV0ZVwiLCBbV2ViV29ya2VyRWxlbWVudFJlZiwgUFJJTUlUSVZFLCBQUklNSVRJVkVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRBdHRyaWJ1dGUsIHRoaXMuX3JlbmRlcmVyKSk7XG4gICAgYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwic2V0RWxlbWVudENsYXNzXCIsIFtXZWJXb3JrZXJFbGVtZW50UmVmLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudENsYXNzLCB0aGlzLl9yZW5kZXJlcikpO1xuICAgIGJyb2tlci5yZWdpc3Rlck1ldGhvZChcInNldEVsZW1lbnRTdHlsZVwiLCBbV2ViV29ya2VyRWxlbWVudFJlZiwgUFJJTUlUSVZFLCBQUklNSVRJVkVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSwgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJpbnZva2VFbGVtZW50TWV0aG9kXCIsIFtXZWJXb3JrZXJFbGVtZW50UmVmLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcmVuZGVyZXIuaW52b2tlRWxlbWVudE1ldGhvZCwgdGhpcy5fcmVuZGVyZXIpKTtcbiAgICBicm9rZXIucmVnaXN0ZXJNZXRob2QoXCJzZXRFdmVudERpc3BhdGNoZXJcIiwgW1JlbmRlclZpZXdSZWZdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX3NldEV2ZW50RGlzcGF0Y2hlciwgdGhpcykpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZGVzdHJveVZpZXcodmlld1JlZjogUmVuZGVyVmlld1JlZik6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lWaWV3KHZpZXdSZWYpO1xuICAgIHRoaXMuX3JlbmRlclZpZXdXaXRoRnJhZ21lbnRzU3RvcmUucmVtb3ZlKHZpZXdSZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlUHJvdG9WaWV3KGNvbXBvbmVudFRlbXBsYXRlSWQ6IHN0cmluZywgY21kczogUmVuZGVyVGVtcGxhdGVDbWRbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZkluZGV4OiBudW1iZXIpIHtcbiAgICB2YXIgcHJvdG9WaWV3UmVmID0gdGhpcy5fcmVuZGVyZXIuY3JlYXRlUHJvdG9WaWV3KGNvbXBvbmVudFRlbXBsYXRlSWQsIGNtZHMpO1xuICAgIHRoaXMuX3JlbmRlclByb3RvVmlld1JlZlN0b3JlLnN0b3JlKHByb3RvVmlld1JlZiwgcmVmSW5kZXgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlUm9vdEhvc3RWaWV3KHJlZjogUmVuZGVyUHJvdG9WaWV3UmVmLCBmcmFnbWVudENvdW50OiBudW1iZXIsIHNlbGVjdG9yOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydEluZGV4OiBudW1iZXIpIHtcbiAgICB2YXIgcmVuZGVyVmlld1dpdGhGcmFnbWVudHMgPSB0aGlzLl9yZW5kZXJlci5jcmVhdGVSb290SG9zdFZpZXcocmVmLCBmcmFnbWVudENvdW50LCBzZWxlY3Rvcik7XG4gICAgdGhpcy5fcmVuZGVyVmlld1dpdGhGcmFnbWVudHNTdG9yZS5zdG9yZShyZW5kZXJWaWV3V2l0aEZyYWdtZW50cywgc3RhcnRJbmRleCk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVWaWV3KHJlZjogUmVuZGVyUHJvdG9WaWV3UmVmLCBmcmFnbWVudENvdW50OiBudW1iZXIsIHN0YXJ0SW5kZXg6IG51bWJlcikge1xuICAgIHZhciByZW5kZXJWaWV3V2l0aEZyYWdtZW50cyA9IHRoaXMuX3JlbmRlcmVyLmNyZWF0ZVZpZXcocmVmLCBmcmFnbWVudENvdW50KTtcbiAgICB0aGlzLl9yZW5kZXJWaWV3V2l0aEZyYWdtZW50c1N0b3JlLnN0b3JlKHJlbmRlclZpZXdXaXRoRnJhZ21lbnRzLCBzdGFydEluZGV4KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldEV2ZW50RGlzcGF0Y2hlcih2aWV3UmVmOiBSZW5kZXJWaWV3UmVmKSB7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKHZpZXdSZWYsIHRoaXMuX2J1cy50byhFVkVOVF9DSEFOTkVMKSwgdGhpcy5fc2VyaWFsaXplcik7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0RXZlbnREaXNwYXRjaGVyKHZpZXdSZWYsIGRpc3BhdGNoZXIpO1xuICB9XG59XG4iXX0=