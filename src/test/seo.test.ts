import { describe, it, expect } from "vitest";
import {
    breadcrumbJsonLd,
    eventJsonLd,
    organizationJsonLd,
    serializeJsonLd,
    utcOffset,
    websiteJsonLd,
} from "../lib/seo";

const SITE = "https://chambalab.org";

describe("utcOffset", () => {
    it("convierte UTC-5 a -05:00", () => {
        expect(utcOffset("UTC-5")).toBe("-05:00");
    });
    it("soporta otros husos y minutos", () => {
        expect(utcOffset("UTC+1")).toBe("+01:00");
        expect(utcOffset("UTC+5:30")).toBe("+05:30");
    });
    it("usa UTC-5 por defecto o ante un formato desconocido", () => {
        expect(utcOffset()).toBe("-05:00");
        expect(utcOffset("America/Lima")).toBe("-05:00");
    });
});

describe("eventJsonLd", () => {
    it("incluye fecha con huso, modo en línea y ubicación virtual", () => {
        const data = eventJsonLd(SITE, {
            name: "Lanzamiento",
            description: "Evento inaugural",
            date: "2026-10-21",
            startTime: "19:00",
            endTime: "20:30",
        });
        expect(data.startDate).toBe("2026-10-21T19:00:00-05:00");
        expect(data.endDate).toBe("2026-10-21T20:30:00-05:00");
        expect(data.eventAttendanceMode).toBe(
            "https://schema.org/OnlineEventAttendanceMode",
        );
        expect(data.location).toMatchObject({ "@type": "VirtualLocation" });
    });
    it("usa solo la fecha si no hay hora y omite endDate", () => {
        const data = eventJsonLd(SITE, {
            name: "Sesión",
            description: "x",
            date: "2026-11-01",
        });
        expect(data.startDate).toBe("2026-11-01");
        expect(data).not.toHaveProperty("endDate");
    });
});

describe("breadcrumbJsonLd", () => {
    it("numera los elementos desde 1 con URLs absolutas", () => {
        const data = breadcrumbJsonLd(SITE, [
            { name: "Inicio", path: "/" },
            { name: "Eventos", path: "/events/" },
        ]);
        expect(data.itemListElement).toEqual([
            {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: `${SITE}/`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Eventos",
                item: `${SITE}/events/`,
            },
        ]);
    });
});

describe("serializeJsonLd", () => {
    it("agrupa varios nodos en un @graph", () => {
        const json = JSON.parse(
            serializeJsonLd([organizationJsonLd(SITE), websiteJsonLd(SITE)]),
        );
        expect(json["@context"]).toBe("https://schema.org");
        expect(json["@graph"]).toHaveLength(2);
    });
    it("escapa < para no cerrar el script", () => {
        const out = serializeJsonLd({ "@type": "Thing", name: "</script>" });
        expect(out).not.toContain("</script>");
        expect(JSON.parse(out).name).toBe("</script>");
    });
});
