<article class="typo-format typo-rhythm">


    @if (@$suptitle)
        <h5 class="typo-suptitle">{{ $suptitle }}</h5>
    @endif
    @if (@$h1)
        <h1 class="typo-h1">{{ $h1 }}</h1>
    @endif
    @if (@$h2)
        <h2 class="typo-h2">{{ $h2 }}</h2>
    @endif
    @if (@$h3)
        <h3 class="typo-h3">{{ $h3 }}</h3>
    @endif
    @if (@$h4)
        <h4 class="typo-h4">{{ $h4 }}</h4>
    @endif
    @if (@$h5)
        <h5 class="typo-h5">{{ $h5 }}</h5>
    @endif
    @if (@$h6)
        <h6 class="typo-h6">{{ $h6 }}</h6>
    @endif
    @if ($subtitle)
        <h5 class="typo-subtitle">{{ $subtitle }}</h5>
    @endif

    @if (@$lead)
        <p class="typo-lead">{{ $lead }}</p>
    @endif
    @if (@$p)
        <p class="typo-p">{{ $p }}</p>
    @endif
    @if (@$text)
        <div class="typo-text">{!! $text !!}</div>
    @endif
    @if (@$richText)
        <p class="typo-rich-text">{!! $richText !!}</p>
    @endif

    @if (@$ul)
        {!! $ul !!}
    @endif
    @if (@$ol)
        {!! $ol !!}
    @endif

    @if (@$blockquote)
        <blockquote class="typo-blockquote">{{ $blockquote }}</blockquote>
    @endif

</article>