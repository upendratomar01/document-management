import "@testing-library/jest-dom";
import { TextEncoder } from "util";
import ResizeObserver from "resize-observer-polyfill";

global.TextEncoder = TextEncoder;
global.ResizeObserver = ResizeObserver;
