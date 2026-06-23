import { test as vitestTest } from "vitest";
import { gwtRunner } from "../src";

export const test = gwtRunner(vitestTest);
