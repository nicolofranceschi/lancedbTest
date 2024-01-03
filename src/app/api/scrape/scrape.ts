import { load, type Element } from 'cheerio';

interface Entry {
  link: string;
  text: string;
}

interface objScrape {
  entries: Entry[];
  links: string[];
  error: string[];
}

async function getEntriesFromLinks(link: string): Promise<objScrape> {

  try {

    let allEntries: Entry[] = [];

    const response = await fetch(link);
    const $ = load(await response.text());

    const contentArray: string[] = [];

    $('p').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('h1').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('h2').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('h3').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('h4').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('h5').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('h6').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('span').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('li').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('th').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('a').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });
    $('td').each((_, element: Element) => {
      contentArray.push($(element).text().trim());
    });

    const links = $("a")

    const linkArray: string[] = [];

    links.each((_, value) => {
      const path = $(value).attr("href");
      if (!path) return true;
      const cleanPath = new URL(path, link).toString();
      if (!cleanPath) return true;
      if (!cleanPath?.startsWith("https")) return true;
      if (cleanPath?.endsWith(".pdf")) return true;
      if (cleanPath?.includes("linkedin") || cleanPath?.includes("facebook") || cleanPath?.includes("wa") || cleanPath?.includes("google") || cleanPath?.includes("iubenda")) return;
      linkArray.push(cleanPath);
    })

    const content = contentArray
      .join('\n')
      .split('\n')
      .filter(line => line.length > 0)
      .map(line => ({ link: link, text: line }));

    allEntries = allEntries.concat(content);

    return {
      entries: allEntries,
      links: linkArray,
      error: []
    };

  } catch (error) {

    return {
      entries: [],
      links: [],
      error: [link]
    };
  }


}

export async function getDomObjects(url: string, pages: number, oldEntries: Entry[], visited: string[], domain: string, nearWebsite: string[], oldError: string[]): Promise<{
  entries: Entry[];
  links: string[];
  error: string[];
}> {

  const { entries, links , error } = await getEntriesFromLinks(url);

  const uniqueLinks = links.filter((c, index) => links.indexOf(c) === index);

  const filterLinks = uniqueLinks.filter(visitedLink => !visited.includes(visitedLink));

  const linkInDomain = filterLinks.filter(currentUrl => (new URL(currentUrl)).hostname === (new URL(domain)).hostname);
  const currentNearWebsite = filterLinks.filter(currentUrl => (new URL(currentUrl)).hostname !== (new URL(domain)).hostname);

  if (pages <= 0) return {
    entries: [...oldEntries, ...entries],
    links: [...nearWebsite, ...currentNearWebsite],
    error: [...oldError, ...error]
  };

  const newPages = pages - 1;

  const linkPromise = linkInDomain.slice(0,100).map(async (link) => {
    return await getDomObjects(link, newPages, [...entries, ...oldEntries], [...visited, ...filterLinks], domain, [...nearWebsite, ...currentNearWebsite], [...error, ...oldError])
  });

  const allLinks = await Promise.all(linkPromise);

  const entriesList = allLinks.map((link) => link.entries).flat();
  const linksList = allLinks.map((link) => link.links).flat();
  const errorList = allLinks.map((link) => link.error).flat();

  return {
    entries: [...entriesList, ...entries, ...oldEntries],
    links: linksList.filter((c, index) => linksList.indexOf(c) === index),
    error: [...errorList,...error, ...oldError]
  };
}
