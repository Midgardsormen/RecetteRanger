<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, IconButton, Title } from '../../components/ui';
  import { Plus, Heart, Trash2, Check } from 'lucide-svelte';

  let { user = null }: { user?: any } = $props();
</script>

<Layout title="Démo Boutons" currentPage="/demo-buttons" {user}>
  <div class="demo">
    <div class="demo__section">
      <Title level={2}>Buttons - Nouveaux variants</Title>

      <div class="demo__grid">
        <div class="demo__item">
          <h3>Primary</h3>
          <Button variant="primary">
            <Plus size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Secondary</h3>
          <Button variant="secondary">
            <Heart size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Tertiary</h3>
          <Button variant="tertiary">Action label</Button>
        </div>

        <div class="demo__item">
          <h3>Accent</h3>
          <Button variant="accent">
            <Plus size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Outlined</h3>
          <Button variant="outlined">Action label</Button>
        </div>

        <div class="demo__item">
          <h3>Ghost</h3>
          <Button variant="ghost">Action label</Button>
        </div>

        <div class="demo__item">
          <h3>Danger</h3>
          <Button variant="danger">
            <Trash2 size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Success</h3>
          <Button variant="success">
            <Check size={20} />
            Action label
          </Button>
        </div>
      </div>
    </div>

    <div class="demo__section demo__section--dark">
      <Title level={2}>Buttons - Fond foncé</Title>

      <div class="demo__grid">
        <div class="demo__item">
          <h3>Primary Inverse</h3>
          <Button variant="primary-inverse">
            <Plus size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Secondary Inverse</h3>
          <Button variant="secondary-inverse">
            <Heart size={20} />
            Action label
          </Button>
        </div>
        <div class="demo__item">
          <h3>Tertiary Inverse</h3>
          <Button variant="tertiary-inverse">
            <Heart size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Accent Inverse</h3>
          <Button variant="accent-inverse">
            <Plus size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Special</h3>
          <Button variant="special">
            <Plus size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Outlined Inverse</h3>
          <Button variant="outlined-inverse">Action label</Button>
        </div>

        <div class="demo__item">
          <h3>Ghost Inverse</h3>
          <Button variant="ghost-inverse">Action label</Button>
        </div>

        <div class="demo__item">
          <h3>Danger Inverse</h3>
          <Button variant="danger-inverse">
            <Trash2 size={20} />
            Action label
          </Button>
        </div>

        <div class="demo__item">
          <h3>Success Inverse</h3>
          <Button variant="success-inverse">
            <Check size={20} />
            Action label
          </Button>
        </div>
      </div>
    </div>

    <div class="demo__section">
      <div class="demo__grid">
        <div class="demo__item">
          <h3>Primary</h3>
          <IconButton variant="primary" size="large" ariaLabel="Primary">
            <Plus size={24} />
          </IconButton>
        </div>

        <div class="demo__item">
          <h3>Secondary</h3>
          <IconButton variant="secondary" size="large" ariaLabel="Secondary">
            <Heart size={24} />
          </IconButton>
        </div>

        <div class="demo__item">
          <h3>Tertiary</h3>
          <IconButton variant="tertiary" size="large" ariaLabel="Tertiary">
            <Plus size={24} />
          </IconButton>
        </div>

        <div class="demo__item">
          <h3>Accent</h3>
          <IconButton variant="accent" size="large" ariaLabel="Accent">
            <Plus size={24} />
          </IconButton>
        </div>



        <div class="demo__item">
          <h3>Default</h3>
          <IconButton variant="default" size="large" ariaLabel="Default">
            <Plus size={24} />
          </IconButton>
        </div>

        <div class="demo__item">
          <h3>Ghost</h3>
          <IconButton variant="ghost" size="large" ariaLabel="Ghost">
            <Plus size={24} />
          </IconButton>
        </div>

        <div class="demo__item">
          <h3>Danger</h3>
          <IconButton variant="danger" size="large" ariaLabel="Danger">
            <Trash2 size={24} />
          </IconButton>
        </div>

        <div class="demo__item">
          <h3>Success</h3>
          <IconButton variant="success" size="large" ariaLabel="Success">
            <Check size={24} />
          </IconButton>
        </div>
      </div>
    </div>

    <div class="demo__section demo__section--dark">
      <Title level={2}>IconButtons - Fond foncé</Title>
       <div class="demo__grid">
      <div class="demo__item">
        <h3>Primary Inverse</h3>
        <IconButton variant="primary-inverse" size="large" ariaLabel="Primary Inverse">
          <Plus size={24} />
        </IconButton>
      </div>
      <div class="demo__item">
        <h3>Secondary Inverse</h3>
        <IconButton variant="secondary-inverse" size="large" ariaLabel="Secondary Inverse">
          <Heart size={24} />
        </IconButton>
      </div>
      <div class="demo__item">
        <h3>Tertiary Inverse</h3>
        <IconButton variant="tertiary-inverse" size="large" ariaLabel="Tertiary Inverse">
          <Plus size={24} />
        </IconButton>
      </div>
      <div class="demo__item">
        <h3>Accent Inverse</h3>
        <IconButton variant="accent-inverse" size="large" ariaLabel="Accent Inverse">
          <Plus size={24} />
        </IconButton>
      </div>
      <div class="demo__item">
        <h3>Special</h3>
        <IconButton variant="special" size="large" ariaLabel="Special">
          <Plus size={24} />
        </IconButton>
      </div>
      <div class="demo__item">
        <h3>Ghost Inverse</h3>
        <IconButton variant="ghost-inverse" size="large" ariaLabel="Ghost Inverse">
          <Plus size={24} />
        </IconButton>
      </div>
      <div class="demo__item">
        <h3>Outlined Inverse</h3>
        <IconButton variant="outlined-inverse" size="large" ariaLabel="Outlined Inverse">
          <Plus size={24} />
        </IconButton>
      </div>
       </div>
   </div>
    <div class="demo__section">
      <Title level={2}>Tailles</Title>
      <div class="demo__grid">
        <div class="demo__item">
          <h3>Buttons</h3>
          <div class="demo__sizes">
            <Button variant="primary" size="small">Small</Button>
            <Button variant="primary" size="medium">Medium</Button>
            <Button variant="primary" size="large">Large</Button>
          </div>
        </div>

        <div class="demo__item">
          <h3>IconButtons</h3>
          <div class="demo__sizes">
            <IconButton variant="primary" size="small" ariaLabel="Small">
              <Plus size={16} />
            </IconButton>
            <IconButton variant="primary" size="medium" ariaLabel="Medium">
              <Plus size={20} />
            </IconButton>
            <IconButton variant="primary" size="large" ariaLabel="Large">
              <Plus size={24} />
            </IconButton>
            <IconButton variant="primary" size="x-large" ariaLabel="X-Large">
              <Plus size={28} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>

    <div class="demo__section">
      <Title level={2}>IconButton Shapes</Title>
      <div class="demo__grid">
        <div class="demo__item">
          <h3>Circle</h3>
          <IconButton variant="primary" size="large" shape="circle" ariaLabel="Circle">
            <Plus size={24} />
          </IconButton>
        </div>

        <div class="demo__item">
          <h3>Square (default)</h3>
          <IconButton variant="primary" size="large" shape="square" ariaLabel="Square">
            <Plus size={24} />
          </IconButton>
        </div>

        <div class="demo__item">
          <h3>Rectangle</h3>
          <IconButton variant="primary" size="large" shape="rectangle" ariaLabel="Rectangle">
            <Plus size={24} />
          </IconButton>
        </div>
      </div>
    </div>

 
    </div>
   
</Layout>

<style lang="scss">
  @use '../../styles/variables' as *;

  .demo {
    max-width: 1200px;
    margin: 0 auto;
    padding: $spacing-xl;

    &__section {
      margin-bottom: $spacing-3xl;
      padding: $spacing-xl;
      background: $color-white;
      border-radius: $radius-lg;
      box-shadow: $shadow-md;

      &--dark {
        background: linear-gradient(135deg, $brand-primary 0%, darken($brand-primary, 10%) 100%);
        color: $color-white;

        h3 {
          color: $color-white;
        }
      }

      :global(.title) {
        margin-bottom: $spacing-xl;
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: $spacing-xl;
    }

    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-lg;
      background: rgba($color-white, 0.5);
      border-radius: $radius-md;

      .demo__section--dark & {
        background: rgba($color-white, 0.1);
      }

      h3 {
        margin: 0;
        font-size: $font-size-sm;
        font-weight: $font-weight-semibold;
        color: $color-text-secondary;
        text-align: center;
      }
    }

    &__sizes {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
