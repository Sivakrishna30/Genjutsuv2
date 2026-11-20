# Task 03: Infrastructure & GPU Integration

## Objective
Integrate with the chosen GPU provider's API to dynamically spawn instances and attach persistent storage.

## Steps
1. **Provider API Integration:**
   - Implement backend logic to call the selected GPU provider (e.g., GridShare, E2E Networks) to launch a GPU VM on demand.
   - Securely manage API keys for the cloud provider in environment variables.
2. **Dynamic Storage Mounting:**
   - Configure the VM startup scripts (e.g., cloud-init) to dynamically mount the Persistent Network Disk containing the pre-installed game libraries.
3. **Session & Save Data Management:**
   - Implement instance termination/sleep logic to conserve costs when a session ends.
   - Implement custom save-data syncing to cloud buckets for games without Steam/Epic cloud save support.
