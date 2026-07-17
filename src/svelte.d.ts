declare module "*.svelte" {
  import type { ComponentType } from "svelte";
  const SvelteComponent: ComponentType;
  export default SvelteComponent;
}
