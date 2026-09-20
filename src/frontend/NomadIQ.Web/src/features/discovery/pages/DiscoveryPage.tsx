import { collectTags } from "../format";
import { DestinationCard } from "../components/DestinationCard";
import {
  DiscoveryErrorState,
  DiscoveryLoadingState,
  NoDestinationsState,
  NoRecommendationsState,
} from "../components/DiscoveryStates";
import { RecommendationCard } from "../components/RecommendationCard";
import { RecommendationForm } from "../components/RecommendationForm";
import { useDestinations } from "../hooks/useDestinations";
import { useRecommendations } from "../hooks/useRecommendations";

export function DiscoveryPage() {
  const catalog = useDestinations();
  const recommendations = useRecommendations();

  const tagSuggestions =
    catalog.state.status === "success" ? collectTags(catalog.state.destinations.map((d) => d.tags)) : [];

  return (
    <section>
      <div className="page-header">
        <h1>Discover</h1>
      </div>

      <section className="dashboard-section">
        <h2>Find your destination</h2>
        <p className="eyebrow">Tell us your budget, trip length and style and we'll rank the destinations for you.</p>

        <RecommendationForm
          tagSuggestions={tagSuggestions}
          isSubmitting={recommendations.state.status === "loading"}
          onSubmit={(request) => void recommendations.submit(request)}
        />

        {recommendations.state.status === "loading" && <DiscoveryLoadingState message="Finding destinations…" />}

        {recommendations.state.status === "error" && (
          <DiscoveryErrorState
            title="We couldn't get recommendations"
            message={recommendations.state.message}
            onRetry={recommendations.retry}
          />
        )}

        {recommendations.state.status === "success" &&
          (recommendations.state.results.length === 0 ? (
            <NoRecommendationsState />
          ) : (
            <div className="recommendation-list">
              {recommendations.state.results.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.destination.id}
                  recommendation={recommendation}
                  rank={index + 1}
                />
              ))}
            </div>
          ))}
      </section>

      <section className="dashboard-section">
        <h2>Explore destinations</h2>

        {catalog.state.status === "loading" && <DiscoveryLoadingState message="Loading destinations…" />}

        {catalog.state.status === "error" && (
          <DiscoveryErrorState
            title="We couldn't load destinations"
            message={catalog.state.message}
            onRetry={catalog.retry}
          />
        )}

        {catalog.state.status === "success" &&
          (catalog.state.destinations.length === 0 ? (
            <NoDestinationsState />
          ) : (
            <div className="destination-grid">
              {catalog.state.destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ))}
      </section>
    </section>
  );
}
