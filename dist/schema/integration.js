"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceAPIIntegration = void 0;
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
class ServiceAPIIntegration {
    constructor(props) {
        this.props = props;
        this.$status = ServiceAPIIntegration.Status.Queued;
        this.$errors = null;
    }
    clone() {
        return new ServiceAPIIntegration(this.props);
    }
    toString() {
        return `(${this.type === ServiceAPIIntegration.Type.Add ? "+" : "-"}) ${this.service} ${kleur[ServiceAPIIntegration.StatusColor[this.status]](this.status)}`;
    }
    get information() {
        return {
            type: this.type,
            status: this.status,
            hash: this.schemaHash,
            schema: this.schema,
            service: this.service.id,
        };
    }
    get type() {
        return this.props.type;
    }
    get schema() {
        return this.props.source.schema;
    }
    get schemaHash() {
        return this.props.source.schemaHash;
    }
    get service() {
        return this.props.source.service;
    }
    get reporter() {
        return this.props.source.reporter;
    }
    get status() {
        return this.$status;
    }
    findAction(actionId) {
        return this.props.serviceCatalog.findAction(actionId);
    }
    setFailed(branch, version, errors, integrations) {
        this.$errors = [...errors];
        this.$status = ServiceAPIIntegration.Status.Failed;
        version.addIntegrationHistory(this);
        this.props.source.reporter.error({
            message: "gateway has been failed to updated",
            branch: branch.toString(),
            version: version.toString(),
            integrations: integrations.map(int => int.toString()),
            errors,
        });
    }
    setSucceed(branch, version, updates) {
        this.$status = ServiceAPIIntegration.Status.Succeed;
        version.addIntegrationHistory(this);
        if (updates) {
            this.props.source.reporter.info({
                message: "gateway has been updated successfully",
                branch: branch.toString(),
                version: {
                    from: version.parentVersion && version.parentVersion.toString(),
                    to: version.toString(),
                },
                integrations: version.integrations.map(int => int.toString()),
                updates,
            }, "integration-succeed");
        }
    }
    get errors() {
        return this.$errors;
    }
    setSkipped(branch, version) {
        this.$status = ServiceAPIIntegration.Status.Skipped;
        version.addIntegrationHistory(this);
        this.props.source.reporter.info({
            message: "gateway found no changes",
            branch: branch.toString(),
            version: version.toString(),
        }, "integration-no-changes");
    }
    reportRemoved(branch, version) {
        this.props.source.reporter.info({
            message: "gateway removed given integrated version",
            branch: branch.toString(),
            version: version.toString(),
        }, "integration-removed");
    }
}
exports.ServiceAPIIntegration = ServiceAPIIntegration;
ServiceAPIIntegration.Type = { Add: "add", Remove: "remove" };
ServiceAPIIntegration.Status = { Queued: "queued", Failed: "failed", Succeed: "succeed", Skipped: "skipped" };
ServiceAPIIntegration.StatusColor = { queued: "dim", failed: "red", succeed: "cyan", skipped: "dim" };
//# sourceMappingURL=integration.js.map