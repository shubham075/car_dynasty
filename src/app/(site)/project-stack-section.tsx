import { Container } from "@/components/common/Container";
import { HomeProjects } from "@/components/portfolio/HomeProjects";
import { getSection } from "@/cms/settings";
import { getCategories, getProjects } from "@/cms/content";

/** "Selected work" section: server-rendered data handed to the client filter. */
export function ProjectStackSection() {
  const work = getSection("work");
  const projects = getProjects();
  const filterNames = getCategories()
    .filter((c) => c.showInFilter)
    .map((c) => c.name);

  return (
    <section id="work" className="py-24 border-b border-white/10 bg-[#08090b]">
      <Container size="wide">
        <HomeProjects
          projects={projects}
          categories={filterNames}
          eyebrow={work.eyebrow}
          title={work.title}
          allLabel={work.allLabel}
        />
      </Container>
    </section>
  );
}
