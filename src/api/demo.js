// Local catalog transport. No network requests, credentials, or server required.
const apps = require("../data/demo-apps.json");

function values(value) {
  if (value === undefined || value === null || value === "") return [];
  return (Array.isArray(value) ? value : [value])
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim().toLowerCase()).filter(Boolean);
}

function queryDemo(request) {
  const args = typeof request === "string" ? { url: request } : request;
  if (args.method && args.method.toUpperCase() !== "GET") {
    return { error: { status: 403, data: { message: "This preview is read-only. Nothing was submitted." } } };
  }
  const [rawPath, rawQuery = ""] = args.url.split("?");
  const path = decodeURIComponent(rawPath).replace(/^\/+|\/+$/g, "");
  const query = Object.fromEntries(rawQuery.split("&").filter(Boolean).map((part) => {
    const separator = part.indexOf("=");
    const key = separator < 0 ? part : part.slice(0, separator);
    const value = separator < 0 ? "" : part.slice(separator + 1);
    return [decodeURIComponent(key), decodeURIComponent(value.replace(/\+/g, " "))];
  }));
  const params = { ...query, ...args.params };

  if (path === "dapp/categories") {
    const groups = {};
    apps.forEach((app) => {
      if (!groups[app.category]) groups[app.category] = new Set();
      if (app.subCategory) groups[app.category].add(app.subCategory);
    });
    return { data: { message: "success", data: Object.entries(groups).map(([category, subs]) => ({ category, subCategory: [...subs] })) } };
  }
  if (path === "store/featured") {
    return { data: [{ dappIds: apps.slice(0, 6).map((app) => app.dappId) }] };
  }
  if (path.startsWith("dapp/rate/") || path === "reviews") {
    return { data: { data: [], response: [], page: 1, pageCount: 0, limit: 10 } };
  }
  if (path.startsWith("dapp/search/address/")) return { data: { data: [] } };
  if (path === "fetchuser") return { data: {} };
  if (/^dapp\/.+\/build$/.test(path)) return { data: { success: false, url: "" } };

  if (path.startsWith("dapp/search/") || path === "dapp/queryWithPackageId") {
    const ids = values(path === "dapp/queryWithPackageId" ? params.packages : path.slice("dapp/search/".length));
    const results = apps.filter((app) => ids.includes(app.dappId.toLowerCase()));
    return { data: { data: results, response: results, page: 1, limit: results.length, pageCount: results.length ? 1 : 0 } };
  }
  if (path === "dapp" || path === "dapp/search") {
    const search = values(params.search).join(" ");
    const categories = values(params.categories);
    const subcategories = values(params.subCategory);
    const chains = values(params.chainId);
    const filtered = apps.filter((app) =>
      (!search || [app.name, app.description, app.displayCategory, ...app.tags].join(" ").toLowerCase().includes(search)) &&
      (!categories.length || categories.includes(app.category.toLowerCase())) &&
      (!subcategories.length || subcategories.includes(app.subCategory.toLowerCase())) &&
      (!chains.length || app.chains.some((chain) => chains.includes(String(chain))))
    ).sort((a, b) => a.name.localeCompare(b.name));
    const page = Math.max(1, Math.floor(Number(params.page) || 1));
    const limit = Math.min(100, Math.max(1, Math.floor(Number(params.limit) || 10)));
    const results = filtered.slice((page - 1) * limit, page * limit);
    return { data: { data: results, response: results, page, limit, pageCount: Math.ceil(filtered.length / limit), total: filtered.length } };
  }
  return { error: { status: 404, data: { message: "Not available in this UI preview." } } };
}

module.exports = { queryDemo };
